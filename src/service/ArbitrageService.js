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
		this._swapTransferFunctionName = "Transfer";
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
				
				logger.info("Abitrage opportunity found " + "\n" +
							"ETH network: Current price BLXM " + ethers.utils.formatEther(poolPriceEth) + " USD" + "\n" +
							"BSC network: Current price BLXM " + ethers.utils.formatEther(poolPriceBsc) + " USD");
	
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
		let absoluteProfit;
		let poolPriceDifference = ethers.utils.formatEther(poolPriceEth) - ethers.utils.formatEther(poolPriceBsc);

		if (poolPriceBsc.gt(poolPriceEth)) {
			totalArbitrageBlxm = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(totalPoolBlxmETH, totalPoolUsdcETH, totalPoolBlxmBSC, totalPoolUsdcBSC);
			adjustmentValueUsd = AdjustmentValueService.getAdjustmentValueUsd(totalPoolBlxmETH, totalPoolUsdcETH, totalPoolBlxmBSC, totalPoolUsdcBSC);

			logger.info("ETH < BSC: The BLXM token trades cheaper on the ETH network than on the BSC network. Price difference between the networks: " + Math.abs(poolPriceDifference) +  " USD");

			result = await this.startArbitrageTransferFromEthToBsc(adjustmentValue, adjustmentValueUsd, totalArbitrageBlxm, totalPoolUsdcBSC);

			// TODO: use response from startArbitrageTransferFromEthToBsc (result), workaround because value is null
			let postUsdBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

		    let profit = ethers.utils.formatEther(postUsdBalanceBsc) - ethers.utils.formatEther(preUsdBalanceBsc);
			
			absoluteProfit = await this._calculateAbitrageProfit(result.swapAmount, totalPoolBlxmETH, totalPoolBlxmBSC, profit, "BSC");
			await this._databaseService.AddData({"profit": absoluteProfit, "network": "BSC", "isArbitrageSwap": true}, Profit);
		}
		else {
			totalArbitrageBlxm = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(totalPoolBlxmBSC, totalPoolBlxmBSC, totalPoolBlxmETH, totalPoolUsdcETH);
			adjustmentValueUsd = AdjustmentValueService.getAdjustmentValueUsd(totalPoolBlxmBSC, totalPoolBlxmBSC, totalPoolBlxmETH, totalPoolUsdcETH);

			logger.info("BSC < ETH: The BLXM token trades cheaper on the BSC network than on the ETH network. Price difference between the networks: " + Math.abs(poolPriceDifference) +  " USD");

			result = await this.startArbitrageTransferFromBscToEth(adjustmentValue, adjustmentValueUsd, totalArbitrageBlxm, totalPoolUsdcETH);

			// TODO: use response from startArbitrageTransferFromEthToBsc (result), workaround because value is null
			let postUsdBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			let profit = ethers.utils.formatEther(postUsdBalanceEth) - ethers.utils.formatEther(preUsdBalanceEth);
					
			absoluteProfit = await this._calculateAbitrageProfit(result.swapAmount, totalPoolBlxmBSC, totalPoolBlxmETH, profit, "ETH");
			await this._databaseService.AddData({"profit": absoluteProfit, "network": "ETH", "isArbitrageSwap": true}, Profit);
		}

	}

	async startArbitrageTransferFromEthToBsc(adjustmentValue, adjustmentValueUSDC, totalArbitrageBlxm, totalPoolUsdcEth) {
		// is liqudity available ? 
		if (!totalArbitrageBlxm.isZero()) {
			let totalAdjustmentValue = Utility.bigNumberMin(totalArbitrageBlxm, adjustmentValue);

			logger.info("ETH network: BLXM Liqudity available");
			logger.info("Liqudity of BLXM  in ETH :[" + ethers.utils.formatEther(totalArbitrageBlxm) + "]");

			logger.info("Adjustment value: " + adjustmentValue);

			return await this._bridgeAndSwapToBsc(totalAdjustmentValue);
		}

		// provide liqudity in eth
		// swap and bridge usd
		else {
			logger.warn("ETH network: Not enough BLXM liqudity available. Need to swap USDC from BSC");

			let arbitrageUsdcBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let arbitrageUsdcBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			logger.info("Adjustment value: " + adjustmentValueUSDC);

			if(totalPoolUsdcEth.isZero()) {
				logger.warn("Not enough usdc liquidity in BSC Pool. Need to stop the cycle.");
				this._stopCycle = true;
			}

			// find minimum of the adjustmentValue and pool usd balance
			let totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, totalPoolUsdcEth);

			if(arbitrageUsdcBalanceEth.isZero() && arbitrageUsdcBalanceBsc.isZero()) {
				logger.warn("Stopping the cycle not enough liquidty BLXM or USDC avaible.");
				this._stopCycle = true;
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

			// swap from usd to blxm
			await this._ethContracts.poolContract.swapStablesToToken(usdSwapAmount);

			logger.info("ETH network: Swapped :[" + ethers.utils.formatEther(usdSwapAmount) + "] USDC to BLXM to aquire liquidity.");

			totalAdjustmentValue = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			return await this._bridgeAndSwapToBsc(totalAdjustmentValue);
		}
	}

	async startArbitrageTransferFromBscToEth(adjustmentValue, adjustmentValueUSDC, totalArbitrageBlxm, totalPoolUsdcBsc) {
		// is liqudity avaible ? 
		if (!totalArbitrageBlxm.isZero()) {
			let totalAdjustmentValue = Utility.bigNumberMin(totalArbitrageBlxm, adjustmentValue);

			logger.info("BSC network: Liqudity of BLXM for swap available");
			logger.info("BSC network: Liqudity amount of BLXM :[" + ethers.utils.formatEther(totalArbitrageBlxm) + "]");
			logger.info("Adjustment value: " + adjustmentValue);

			return await this._bridgeAndSwapToEth(totalAdjustmentValue);
		}

		// provide liqudity in bsc
		// swap and bridge usd
		else {
			logger.warn("BSC network: Not enough BLXM liqudity. Need to swap USDC");

			let arbitrageUsdcBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let arbitrageUsdcBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			logger.info("Adjustment value: " + adjustmentValueUSDC);

			if(totalPoolUsdcBsc.isZero()) {
				logger.warn("Not enough usdc liquidity in BSC Pool. Need to stop the cycle.");
				this._stopCycle = true;
			}

			// find minimum of the adjustmentValue and pool usd balance
			let totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, totalPoolUsdcBsc);

			if(arbitrageUsdcBalanceEth.isZero() && arbitrageUsdcBalanceBsc.isZero()) {
				logger.warn("Stopping the cycle not enough liquidty BLXM or USDC avaible.");
				this._stopCycle = true;
			}

			if(!arbitrageUsdcBalanceBsc.isZero()) {
				totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, arbitrageUsdcBalanceBsc);
			}

			// provide liquidity from expensive network via usd
			else if (!arbitrageUsdcBalanceEth.isZero()) {
				// take minimum Usd in ETH, if arbitrage total of usd is not equals to adjustmentValueUSDC
				totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, arbitrageUsdcBalanceEth);

				// bridge usdc from eth to bsc
				await this._bridgeService.bridgeUSDTokenEthToBsc(totalAdjustmentValue);
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
		let profit = this._bscContracts.poolContract.swapTokenToStables(totalAdjustmentValue);

		return { profit: profit, swapAmount: totalAdjustmentValue };
	}

	async _calculateAbitrageProfit(swapAmountBlxm, startPriceCheapBLXM, startPriceExpensiveBLXM, profit, network) {
		let capitalLoss;
		swapAmountBlxm = ethers.utils.formatEther(swapAmountBlxm);
		startPriceCheapBLXM = ethers.utils.formatEther(startPriceCheapBLXM);
		startPriceExpensiveBLXM = ethers.utils.formatEther(startPriceExpensiveBLXM);

		//Calculate how much the abitrage costs us 
		let inputFactor = swapAmountBlxm * startPriceCheapBLXM; //Cheap BLXM

		let poolPriceBsc = ethers.utils.formatEther(await this._bscContracts.getPoolPrice());
		let poolPriceEth = ethers.utils.formatEther(await this._ethContracts.getPoolPrice());
		let totalArbitrageBlxmEth = ethers.utils.formatEther(await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS));
		let totalArbitrageBlxmBsc = ethers.utils.formatEther(await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS));

		//Calculate the loss that happens because of changed price in our abitrage wallet 
		if (network === "BSC") {
			capitalLoss = (startPriceExpensiveBLXM - poolPriceBsc) * totalArbitrageBlxmBsc;
		} else {
			capitalLoss = (startPriceExpensiveBLXM - poolPriceEth) * totalArbitrageBlxmEth;
		}

		let absoluteAbitrageProfit = profit - inputFactor - capitalLoss;

		logger.info("Profit:   " + profit + " USD");
		logger.info("Input factor:   " + inputFactor + " USD");
		logger.info("Capital loss:   " + capitalLoss + " USD");
		logger.verbose("The abitrage trade made in sum : [" + absoluteAbitrageProfit + "] USD absolute profit");

		return absoluteAbitrageProfit;
	}
}


module.exports = ArbitrageService;
