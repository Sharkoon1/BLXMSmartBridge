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
		let balanceBlxmBSC = await this._bscContracts.getPoolNumberOfBlxmToken();
		let balanceUsdcBSC = await this._bscContracts.getPoolNumberOfUsdToken();
		let balanceBlxmETH = await this._ethContracts.getPoolNumberOfBlxmToken();
		let balanceUsdcETH = await this._ethContracts.getPoolNumberOfUsdToken();

		// TODO: use response from startArbitrageTransferFromEthToBsc (result) to calculate profit, workaround because value is null
		let preUsdBalanceBsc = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
		let preUsdBalanceEth = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

		let adjustmentValue;
		let adjustmentValueUsd;
		let arbitrageBlxmBalance;
		let result;
		let absoluteProfit;
		let poolPriceDifference = ethers.utils.formatEther(poolPriceEth) - ethers.utils.formatEther(poolPriceBsc);

		if (poolPriceBsc.gt(poolPriceEth)) {
			arbitrageBlxmBalance = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmETH, balanceUsdcETH, balanceBlxmBSC, balanceUsdcBSC);
			adjustmentValueUsd = AdjustmentValueService.getAdjustmentValueUsd(balanceBlxmETH, balanceUsdcETH, balanceBlxmBSC, balanceUsdcBSC);

			logger.info("ETH < BSC: The BLXM token trades cheaper on the ETH network than on the BSC network. Price difference between the networks:" + Math.abs(poolPriceDifference) +  " USD");

			result = await this.startArbitrageTransferFromEthToBsc(adjustmentValue, adjustmentValueUsd, arbitrageBlxmBalance, balanceUsdcETH);

			// TODO: use response from startArbitrageTransferFromEthToBsc (result), workaround because value is null
			let postUsdBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

		    let profit = ethers.utils.formatEther(postUsdBalanceBsc) - ethers.utils.formatEther(preUsdBalanceBsc);
			
			absoluteProfit = await this._calculateAbitrageProfit(result.swapAmount, balanceBlxmETH, balanceBlxmBSC, profit, "BSC");
			await this._databaseService.AddData({"profit": absoluteProfit, "network": "BSC", "isArbitrageSwap": true}, Profit);
		}
		else {
			arbitrageBlxmBalance = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmBSC, balanceUsdcBSC, balanceBlxmETH, balanceUsdcETH);
			adjustmentValueUsd = AdjustmentValueService.getAdjustmentValueUsd(balanceBlxmBSC, balanceUsdcBSC, balanceBlxmETH, balanceUsdcETH);

			logger.info("BSC < ETH: The BLXM token trades cheaper on the BSC network than on the ETH network. Price difference between the networks :" + Math.abs(poolPriceDifference) +  " USD");

			result = await this.startArbitrageTransferFromBscToEth(adjustmentValue, adjustmentValueUsd, arbitrageBlxmBalance, balanceUsdcETH);

			// TODO: use response from startArbitrageTransferFromEthToBsc (result), workaround because value is null
			let postUsdBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			let profit = ethers.utils.formatEther(postUsdBalanceEth) - ethers.utils.formatEther(preUsdBalanceEth);
					
			absoluteProfit = await this._calculateAbitrageProfit(result.swapAmount, balanceBlxmBSC, balanceBlxmETH, profit, "ETH");
			await this._databaseService.AddData({"profit": absoluteProfit, "network": "ETH", "isArbitrageSwap": true}, Profit);
		}

	}

	async startArbitrageTransferFromEthToBsc(adjustmentValue, adjustmentValueUSDC, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdc) {
		// is liqudity available ? 
		if (!arbitrageBlxmBalance.isZero()) {
			logger.info("ETH network: BLXM Liqudity available");
			logger.info("Liqudity of BLXM  in ETH :[" + ethers.utils.formatEther(arbitrageBlxmBalance) + "]");

			logger.info("Adjustment value: " + adjustmentValue);

			return await this._bridgeAndSwapToBsc(adjustmentValue, arbitrageBlxmBalance);
		}

		// provide liqudity in bsc
		// swap and bridge usd
		else {
			logger.warn("ETH network: Not enough BLXM liqudity available. Need to swap USDC from BSC");

			let arbitrageUsdcBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let arbitrageUsdcBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let usdcSwapAmount = 0;

			logger.info("Adjustment value: " + adjustmentValueUSDC);


			// provide liquidity from cheap network via usd
			if (!arbitrageUsdcBalanceEth.isZero()) {
				// cheap network    
				usdcSwapAmount = Utility.bigNumberMin(adjustmentValueUSDC, balanceUsdc);
			}

			// provide liquidity from expensive network via usd
			else if (!arbitrageUsdcBalanceBsc.isZero()) {
				// expensive network     
				usdcSwapAmount = Utility.bigNumberMin(adjustmentValueUSDC, balanceUsdc);

				// bridge usdc from bsc to eth
				await this._bridgeService.bridgeBLXMTokenBscToEth(usdcSwapAmount);
			}

			else {
				logger.warn("Stopping the cycle not enough liquidty BLXM or USDC avaible.");
				this._stopCycle = true;
			}

			// swap from usd to blxm
			await this._ethContracts.poolContract.swapStablesToToken(usdcSwapAmount);


			logger.info("ETH network: Swapped :[" + ethers.utils.formatEther(usdcSwapAmount) + "] USDC to BLXM to aquire liquidity.");

			arbitrageBlxmBalance = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			return await this._bridgeAndSwapToBsc(arbitrageBlxmBalance, arbitrageBlxmBalance);
		}
	}

	async startArbitrageTransferFromBscToEth(adjustmentValue, adjustmentValueUSDC, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdc) {
		// is liqudity avaible ? 
		if (!arbitrageBlxmBalance.isZero()) {
			logger.info("BSC network: Liqudity of BLXM for swap available");
			logger.info("BSC network: Liqudity amount of BLXM :[" + ethers.utils.formatEther(arbitrageBlxmBalance) + "]");
			logger.info("Adjustment value: " + adjustmentValue);

			return await this._bridgeAndSwapToEth(adjustmentValue, arbitrageBlxmBalance);
		}

		// provide liqudity in bsc
		// swap and bridge usd
		else {
			logger.warn("BSC network: Not enough BLXM liqudity. Need to swap USDC");

			let arbitrageUsdcBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let arbitrageUsdcBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let usdSwapAmount = 0;
			logger.info("Adjustment value: " + adjustmentValueUSDC);

			// provide liquidity from cheap network via usd
			if (!arbitrageUsdcBalanceBsc.isZero()) {		
				// cheap network    
				usdSwapAmount = Utility.bigNumberMin(adjustmentValueUSDC, balanceUsdc);
			}

			// provide liquidity from expensive network via usd
			else if (!arbitrageUsdcBalanceEth.isZero()) {
				
				// expensive network                         
				usdSwapAmount = Utility.bigNumberMin(adjustmentValueUSDC, balanceUsdc);

				// bridge usdc from eth to bsc
				await this._bridgeService.bridgeUSDTokenEthToBsc(usdSwapAmount);
			}

			else {
				logger.warn("Stopping the cycle not enough liquidty BLXM or USDC avaible.");
				this._stopCycle = true;
			}

			// swap usd from bsc to blxm
			await this._bscContracts.poolContract.swapStablesToToken(usdSwapAmount);

			logger.info("BSC network: Swapped :[" + ethers.utils.formatEther(usdSwapAmount) + "] USDC to BLXM to aquire liquidity.");

			arbitrageBlxmBalance = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			return await this._bridgeAndSwapToEth(arbitrageBlxmBalance, arbitrageBlxmBalance);
		}
	}

	async _bridgeAndSwapToEth(amount, abitrageBalance) {
		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Utility.bigNumberMin(amount, abitrageBalance);

		// bridge blxm tokens
		logger.info("BSC network: Bridging :[" + ethers.utils.formatEther(swapAmount) + "] BLXM from BSC to ETH.");
		await this._bridgeService.bridgeBLXMTokenBscToEth(swapAmount);

		logger.info("ETH network: Swapping :[" + ethers.utils.formatEther(swapAmount) + "] BLXM to USDC.");
		let profit = await this._ethContracts.poolContract.swapTokenToStables(swapAmount);

		return { profit: profit, swapAmount: swapAmount };
	}

	async _bridgeAndSwapToBsc(amount, abitrageBalance) {
		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Utility.bigNumberMin(amount, abitrageBalance);

		// bridge blxm tokens
		logger.info("ETH network: Bridging : [" + ethers.utils.formatEther(swapAmount) + "] BLXM from ETH to BSC.");
		await this._bridgeService.bridgeBLXMTokenEthToBsc(swapAmount);

		logger.info("BSC network: Swapping : [" + ethers.utils.formatEther(swapAmount) + "] BLXM to USDC.");
		let profit = this._bscContracts.poolContract.swapTokenToStables(swapAmount);

		return { profit: profit, swapAmount: swapAmount };
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
		let arbitrageBlxmBalanceEth = ethers.utils.formatEther(await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS));
		let arbitrageBlxmBalanceBsc = ethers.utils.formatEther(await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS));

		//Calculate the loss that happens because of changed price in our abitrage wallet 
		if (network === "BSC") {
			capitalLoss = (startPriceExpensiveBLXM - poolPriceBsc) * arbitrageBlxmBalanceBsc;
		} else {
			capitalLoss = (startPriceExpensiveBLXM - poolPriceEth) * arbitrageBlxmBalanceEth;
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
