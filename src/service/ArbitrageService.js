const logger = require("../logger/logger");
const constants = require("../constants");
const { ethers } = require("ethers");
const Utility = require("../helpers/utility");
const AdjustmentValueService = require("./AdjustmentValueService");
const Contracts = require("../contracts/Contracts");
const DataBaseService = require("./DataBaseService");
const Profit = require("../models/Profit");

class ArbitrageService {

	constructor(bridgeService, walletContainer) {
		this._bridgeService = bridgeService;
		this._databaseService = DataBaseService;
		

		this._ethContracts = new Contracts("ETH", walletContainer.ArbitrageWalletETH);
		this._bscContracts = new Contracts("BSC", walletContainer.ArbitrageWalletBSC);

		this._isRunning = false;
		this._stopCycle = false;
	}

	async startArbitrage() {
		if(!this._isRunning) {
			this._isRunning = true;
			this._stopCycle = false;

			logger.info("Start AbitrageService ...");
			let poolPriceBsc = await this._bscContracts.getPoolPrice();
			let poolPriceEth = await this._ethContracts.getPoolPrice();

			while (!poolPriceBsc.eq(poolPriceEth)) {
				
				logger.info("Price difference  found ");			
				logger.info("ETH network: Current price BLXM " + ethers.utils.formatEther(poolPriceEth) + " USD");
				logger.info("BSC network: Current price BLXM " + ethers.utils.formatEther(poolPriceBsc) + " USD");
	
				await this._startArbitrageCycle(poolPriceBsc, poolPriceEth);
				if(this._stopCycle) {
					return false;
				}

				poolPriceBsc = await this._bscContracts.getPoolPrice();
				poolPriceEth = await this._ethContracts.getPoolPrice();
			}

			this._isRunning = false;
		}
	}

	async _startArbitrageCycle(poolPriceBsc, poolPriceEth) {
		let totalPoolBlxmBSC = await this._bscContracts.getPoolNumberOfBlxmToken();
		let totalPoolUsdcBSC = await this._bscContracts.getPoolNumberOfUsdToken();
		let totalPoolBlxmETH = await this._ethContracts.getPoolNumberOfBlxmToken();
		let totalPoolUsdcETH = await this._ethContracts.getPoolNumberOfUsdToken();

		// TODO: use response from startArbitrageTransferFromEthToBsc (result) to calculate profit, workaround because value is null
		let preUsdBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
		let preUsdBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

		let adjustmentValue;
		let adjustmentValueUsd;
		let totalArbitrageBlxm;
		let result;
		let poolPriceDifference = ethers.utils.formatEther(poolPriceEth) - ethers.utils.formatEther(poolPriceBsc);
		let minimumSwapAmountValue = await this.minimumSwapAmount(poolPriceBsc, poolPriceEth);

		if (poolPriceBsc.gt(poolPriceEth)) {
			totalArbitrageBlxm = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(totalPoolBlxmETH, totalPoolUsdcETH, totalPoolBlxmBSC, totalPoolUsdcBSC);
			adjustmentValueUsd = AdjustmentValueService.getAdjustmentValueUsd(totalPoolBlxmETH, totalPoolUsdcETH, totalPoolBlxmBSC, totalPoolUsdcBSC);

			logger.info("ETH < BSC: The BLXM token trades cheaper on the ETH network than on the BSC network. Price difference between the networks: " + Math.abs(poolPriceDifference) +  " USD");

			result = await this.startArbitrageTransferFromEthToBsc(adjustmentValue, adjustmentValueUsd, totalArbitrageBlxm, totalPoolUsdcBSC, minimumSwapAmountValue);

			// cancel cycle
			if(result === -1) {
				return;
			}

			// TODO: use response from startArbitrageTransferFromEthToBsc (result), workaround because value is null
			let postUsdBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

		    let profit = ethers.utils.formatEther(postUsdBalanceBsc) - ethers.utils.formatEther(preUsdBalanceBsc);
			let absoluteProfit = await this._calculateAbitrageProfit(result.swapAmount, poolPriceEth, profit);

			await this._databaseService.AddData({"profit": absoluteProfit, "network": "BSC", "isArbitrageSwap": true}, Profit);
		}
		else {
			totalArbitrageBlxm = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(totalPoolBlxmBSC, totalPoolBlxmBSC, totalPoolBlxmETH, totalPoolUsdcETH);
			adjustmentValueUsd = AdjustmentValueService.getAdjustmentValueUsd(totalPoolBlxmBSC, totalPoolBlxmBSC, totalPoolBlxmETH, totalPoolUsdcETH);

			logger.info("BSC < ETH: The BLXM token trades cheaper on the BSC network than on the ETH network. Price difference between the networks: " + Math.abs(poolPriceDifference) +  " USD");

			result = await this.startArbitrageTransferFromBscToEth(adjustmentValue, adjustmentValueUsd, totalArbitrageBlxm, totalPoolUsdcETH, minimumSwapAmountValue);

			// cancel cycle
			if(result === -1) {
				return;
			}

			// TODO: use response from startArbitrageTransferFromEthToBsc (result), workaround because value is null
			let postUsdBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			let profit = ethers.utils.formatEther(postUsdBalanceEth) - ethers.utils.formatEther(preUsdBalanceEth);
			let absoluteProfit = await this._calculateAbitrageProfit(result.swapAmount, poolPriceBsc, profit);

			await this._databaseService.AddData({"profit": absoluteProfit, "network": "ETH", "isArbitrageSwap": true}, Profit);
		}
	}

	async startArbitrageTransferFromEthToBsc(adjustmentValue, adjustmentValueUSDC, totalArbitrageBlxm, totalPoolUsdcEth, minimumSwapAmountValue) {
		// is liqudity available ? 
		if (!totalArbitrageBlxm.isZero()) {
			let totalAdjustmentValue = Utility.bigNumberMin(totalArbitrageBlxm, adjustmentValue);

			logger.info("ETH network: BLXM Liqudity available");
			logger.info("Liqudity of BLXM  in ETH :[" + ethers.utils.formatEther(totalArbitrageBlxm) + "]");

			logger.info("Adjustment value BLXM: " + ethers.utils.formatEther(adjustmentValue));

			if(minimumSwapAmountValue.minimumSwapAmountBLXM > ethers.utils.formatEther(totalAdjustmentValue)) {
				logger.warn("Minimum swap BLXM amount is less than the adjustment value. Canceling current cycle.");

				return  -1;
			}

			return await this._bridgeAndSwapToBsc(totalAdjustmentValue);
		}

		// provide liqudity in eth
		// swap and bridge usd
		else {
			logger.warn("ETH network: Not enough BLXM liqudity available. Need to swap USDC from BSC");

			let arbitrageUsdcBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let arbitrageUsdcBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			logger.info("Adjustment value USD: " + ethers.utils.formatEther(adjustmentValueUSDC));

			if(totalPoolUsdcEth.isZero()) {
				logger.warn("Not enough usdc liquidity in BSC Pool. Need to stop the cycle.");
				this._stopCycle = true;

				return  -1;
			}

			// find minimum of the adjustmentValue and pool usd balance
			let totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, totalPoolUsdcEth);

			if(arbitrageUsdcBalanceEth.isZero() && arbitrageUsdcBalanceBsc.isZero()) {
				logger.warn("Stopping the cycle not enough liquidty BLXM or USDC avaible.");
				this._stopCycle = true;

				return  -1;
			}
	
			if(!arbitrageUsdcBalanceEth.isZero()) {
				totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, arbitrageUsdcBalanceEth);
			}

			// provide liquidity from expensive network via usd
			else if (!arbitrageUsdcBalanceBsc.isZero()) {
				// take minimum Usd in BSC, if arbitrage total of usd is not equals to adjustmentValueUSDC
				totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, arbitrageUsdcBalanceBsc);
				
				// bridge usdc from bsc to eth
				await this._bridgeService.bridgeBLXMTokenBscToEth(totalAdjustmentValue);
			}

			if(minimumSwapAmountValue.minimumSwapAmountUSD > ethers.utils.formatEther(totalAdjustmentValue)) {
				logger.warn("Minimum swap USD amount is less than the adjustment value. Canceling current cycle.");

				return  -1;
			}

			// swap from usd to blxm
			await this._ethContracts.poolContract.swapStablesToToken(totalAdjustmentValue);

			logger.info("ETH network: Swapped :[" + ethers.utils.formatEther(totalAdjustmentValue) + "] USDC to BLXM to aquire liquidity.");

			totalAdjustmentValue = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			return await this._bridgeAndSwapToBsc(totalAdjustmentValue);
		}
	}

	async startArbitrageTransferFromBscToEth(adjustmentValue, adjustmentValueUSDC, totalArbitrageBlxm, totalPoolUsdcBsc, minimumSwapAmountValue) {
		// is liqudity avaible ? 
		if (!totalArbitrageBlxm.isZero()) {
			let totalAdjustmentValue = Utility.bigNumberMin(totalArbitrageBlxm, adjustmentValue);

			logger.info("BSC network: Liqudity of BLXM for swap available");
			logger.info("BSC network: Liqudity amount of BLXM :[" + ethers.utils.formatEther(totalArbitrageBlxm) + "]");
			logger.info("Adjustment value BLXM: " + adjustmentValue);

			if(minimumSwapAmountValue.minimumSwapAmountBLXM > ethers.utils.formatEther(totalAdjustmentValue)) {
				return  -1;
			}

			return await this._bridgeAndSwapToEth(totalAdjustmentValue);
		}

		// provide liqudity in bsc
		// swap and bridge usd
		else {
			logger.warn("BSC network: Not enough BLXM liqudity. Need to swap USDC");

			let arbitrageUsdcBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let arbitrageUsdcBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			logger.info("Adjustment value USD: " + ethers.utils.formatEther(adjustmentValueUSDC));

			if(totalPoolUsdcBsc.isZero()) {
				logger.warn("Not enough usdc liquidity in BSC Pool. Need to stop the cycle.");
				this._stopCycle = true;

				return -1;
			}

			// find minimum of the adjustmentValue and pool usd balance
			let totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, totalPoolUsdcBsc);

			if(arbitrageUsdcBalanceEth.isZero() && arbitrageUsdcBalanceBsc.isZero()) {
				logger.warn("Stopping the cycle not enough liquidty BLXM or USDC avaible.");
				this._stopCycle = true;

				return -1;
			}

			if(!arbitrageUsdcBalanceBsc.isZero()) {
				totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, arbitrageUsdcBalanceBsc);
			}

			// provide liquidity from expensive network via usd
			else if (!arbitrageUsdcBalanceEth.isZero()) {
				// take minimum Usd in ETH, if arbitrage total of usd is not equals to adjustmentValueUSDC
				totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, arbitrageUsdcBalanceEth);

				if(totalAdjustmentValue.gt(arbitrageUsdcBalanceEth)) {
					this._stopCycle = true;

					return -1;
				}

				// bridge usdc from eth to bsc
				await this._bridgeService.bridgeUSDTokenEthToBsc(totalAdjustmentValue);
			}

			
			if(minimumSwapAmountValue.minimumSwapAmountUSD > ethers.utils.formatEther(totalAdjustmentValue)) {
				logger.warn("Minimum swap USD amount is less than the adjustment value. Canceling current cycle.");

				return  -1;
			}

			// swap from usd to blxm
			await this._bscContracts.poolContract.swapStablesToToken(totalAdjustmentValue);

			logger.info("BSC network: Swapped :[" + ethers.utils.formatEther(totalAdjustmentValue) + "] USDC to BLXM to aquire liquidity.");

			totalAdjustmentValue = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			return await this._bridgeAndSwapToEth(totalAdjustmentValue);
		}
	}

	async _bridgeAndSwapToEth(totalAdjustmentValue) {
		// bridge blxm tokens
		logger.info("BSC network: Bridging :[" + ethers.utils.formatEther(totalAdjustmentValue) + "] BLXM from BSC to ETH.");
		await this._bridgeService.bridgeBLXMTokenBscToEth(totalAdjustmentValue);

		logger.info("ETH network: Swapping :[" + ethers.utils.formatEther(totalAdjustmentValue) + "] BLXM to USDC.");
		let profit = await this._ethContracts.poolContract.swapTokenToStables(totalAdjustmentValue);

		return { profit: profit, swapAmount: totalAdjustmentValue };
	}

	async _bridgeAndSwapToBsc(totalAdjustmentValue) {
		// bridge blxm tokens
		logger.info("ETH network: Bridging : [" + ethers.utils.formatEther(totalAdjustmentValue) + "] BLXM from ETH to BSC.");
		await this._bridgeService.bridgeBLXMTokenEthToBsc(totalAdjustmentValue);

		logger.info("BSC network: Swapping : [" + ethers.utils.formatEther(totalAdjustmentValue) + "] BLXM to USDC.");
		let profit = await this._bscContracts.poolContract.swapTokenToStables(totalAdjustmentValue);

		return { profit: profit, swapAmount: totalAdjustmentValue };
	}

	async _calculateAbitrageProfit(swapAmountBlxm, startPriceCheapBLXM, profit) {
		swapAmountBlxm = ethers.utils.formatEther(swapAmountBlxm);
		startPriceCheapBLXM = ethers.utils.formatEther(startPriceCheapBLXM);

		//Calculate how much the abitrage costs us 
		let inputFactor = swapAmountBlxm * startPriceCheapBLXM; //Cheap BLXM

		//Calculate the loss that happens because of changed price in our abitrage wallet 
		let absoluteAbitrageProfit = profit - inputFactor;

		logger.info("Input factor:   " + inputFactor + " USD");
		logger.info("The abitrage trade made in sum : [" + absoluteAbitrageProfit + "] USD absolute profit");

		return absoluteAbitrageProfit;
	}

	async minimumSwapAmount(poolPriceBsc, poolPriceEth){
		poolPriceBsc = ethers.utils.formatEther(poolPriceBsc);
		poolPriceEth = ethers.utils.formatEther(poolPriceEth);

		//Transaction fees in USD 
		let feeSwaps = {tokenToStablesETH: 0.13, stablesToTokenETH: 0.14, tokenToStablesBSC: 0.12, stablesToTokenBSC: 0.15}; // Swap gasfee in USD 
		let feeBridge = {fromETHtoBSC: 0.14, fromBSCtoETH: 0.12};                                                            // Bridge gasfee in USD 
    
		//Transactions per cycle
		let transactions = await this.countTransactionsPerCycle(poolPriceBsc, poolPriceEth);
		let swapsTransaction = transactions[0];
		let bridgeTransactions = transactions[1];
    
		//Calculate transaction fees per cycle 
		//Fees ETH 
		let feesSwapETH = swapsTransaction.tokenToStablesETH * feeSwaps.tokenToStablesETH + swapsTransaction.stablesToTokenETH * feeSwaps.stablesToTokenBSC;
		let feesBridgeETH = feeBridge.fromETHtoBSC * bridgeTransactions.fromETHtoBSC;
    
		//Fees BSC 
		let feesSwapBSC = swapsTransaction.tokenToStablesBSC * feeSwaps.tokenToStablesBSC + swapsTransaction.stablesToTokenBSC * feeSwaps.stablesToTokenBSC;
		let feesBridgeBSC = feeBridge.fromBSCtoETH * bridgeTransactions.fromBSCtoETH;
    
		//Sum fees
		let sumFees = feesSwapETH + feesBridgeETH + feesSwapBSC + feesBridgeBSC;
    
		// Calculate minumum swap amount 
		// Minimum minimumSwapAmount = X = -( TXcost )/(priceCheapBLXM  + standardDeviation  - priceExpensiveBLXM)
		// Whereas priceCheapBLXM  + standardDeviationCheapBLXM <= priceExpensiveBLXM

		let priceExpensiveBLXM;
		let priceCheapBLXM;
    
		if(poolPriceBsc > poolPriceEth){
			priceExpensiveBLXM = poolPriceBsc;
			priceCheapBLXM = poolPriceEth;
		} else {
			priceExpensiveBLXM = poolPriceEth;
			priceCheapBLXM = poolPriceBsc;
		}
        
		let standardDeviation = this.getStandardDeviation();
    
		if (priceCheapBLXM + standardDeviation <  priceExpensiveBLXM) {
			var minimumSwapAmountUSD = -( sumFees )/(priceCheapBLXM  + standardDeviation  - priceExpensiveBLXM); 
			var minimumSwapAmountBLXM  = minimumSwapAmountUSD / priceCheapBLXM;

			logger.info("Minimum swap amount usd: " + minimumSwapAmountUSD);
			logger.info("Minimum swap amount blxm: " + minimumSwapAmountBLXM);

			return {minimumSwapAmountUSD: minimumSwapAmountUSD, minimumSwapAmountBLXM: minimumSwapAmountBLXM};
    
		} else {
			return -1;
		}
    
	}

	async countTransactionsPerCycle(poolPriceBsc, poolPriceEth){

		let swapsTransaction = {tokenToStablesETH: 0, stablesToTokenETH: 0, tokenToStablesBSC: 0, stablesToTokenBSC: 0};
		let bridgeTransactions = {fromETHtoBSC: 0, fromBSCtoETH: 0};
		let transactions = [swapsTransaction, bridgeTransactions];


		//evaluates which path the Arbitrage bot chooses to perform the value Adjustment
		if (poolPriceBsc > poolPriceEth) {
			let arbitrageBlxmBalance = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			if (!arbitrageBlxmBalance.isZero()) { 
				//first option: two transactions (one bridge in ETH -> one swap in BSC)
				bridgeTransactions.fromETHtoBSC = 1;    // Bridge calculated amount to expensive_BLXM_network
				swapsTransaction.tokenToStablesBSC = 1; // Add bridged cheap_BLXM to expensive_BLXM LP
			}
            
			else {
				let arbitrageUSDCBalance = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
				if (!arbitrageUSDCBalance.isZero()) { 
					//second option: three transactions (one swap in ETH -> one bridge in ETH -> one swap in BSC)
					swapsTransaction.stablesToTokenETH = 1; // Swap USDC to cheap_BLXM
					bridgeTransactions.fromETHtoBSC = 1;        // Bridge calculated amount to expensive_BLXM_network
					swapsTransaction.tokenToStablesBSC = 1; // Add bridged cheap_BLXM to expensive_BLXM LP
				}

				else {
					//third option: four transactions (one bridge in BSC -> one swap in ETH -> one bridge in ETH -> one swap in BSC)
					bridgeTransactions.fromBSCtoETH = 1;    // Bridge USDC to cheap_BLXM_network
					swapsTransaction.stablesToTokenETH = 1; // Swap USDC to cheap_BLXM
					bridgeTransactions.fromETHtoBSC = 1;    // Bridge calculated amount to expensive_BLXM_network
					swapsTransaction.tokenToStablesBSC = 1; // Add bridged cheap_BLXM to expensive_BLXM LP
				}
			}
		}
		else if (poolPriceEth > poolPriceBsc){
			let arbitrageBlxmBalance = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			if (!arbitrageBlxmBalance.isZero()) { 
				//first option: two transactions (one bridge in BSC -> one swap in ETH)
				bridgeTransactions.fromBSCtoETH = 1;    // Bridge calculated amount to expensive_BLXM_network
				swapsTransaction.tokenToStablesETH = 1; // Add bridged cheap_BLXM to expensive_BLXM LP
			}
			else {
				let arbitrageUSDCBalance = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
				if (!arbitrageUSDCBalance.isZero()) { 
					//second option: three transactions (one swap in BSC -> one bridge in BSC -> one swap in ETH)
					swapsTransaction.stablesToTokenBSC = 1; // Swap USDC to cheap_BLXM
					bridgeTransactions.fromBSCtoETH = 1;    // Bridge calculated amount to expensive_BLXM_network
					swapsTransaction.tokenToStablesETH = 1; // Add bridged cheap_BLXM to expensive_BLXM LP
				}
				else{
					//third option: four transactions (one bridge in ETH -> one swap in BSC -> one bridge in BSC -> one swap in ETH)
					bridgeTransactions.fromETHtoBSC = 1;    // Bridge USDC to cheap_BLXM_network
					swapsTransaction.stablesToTokenBSC = 1; // Swap USDC to cheap_BLXM
					bridgeTransactions.fromBSCtoETH = 1;    // Bridge calculated amount to expensive_BLXM_network
					swapsTransaction.tokenToStablesETH = 1; // Add bridged cheap_BLXM to expensive_BLXM LP
				}
			}
		}

		else {
			return false;
		}

		return transactions;
	}
    
	getStandardDeviation(){
		// get data 
		var standardDeviation = 1;
		// Return standardDeviation of cheap network in USD per BLXM 
    
		return standardDeviation;
	}

}


module.exports = ArbitrageService;
