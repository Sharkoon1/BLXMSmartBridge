const logger = require("../logger/logger");
const constants = require("../constants");
const { ethers } = require("ethers");
const Utility = require("../helpers/utility");
const AdjustmentValueService = require("./AdjustmentValueService");
const Contracts = require("../contracts/Contracts");
const DataBaseService = require("./DataBaseService");
const Profit = require("../models/Profit");
const EvaluationService = require("./EvaluationService");

class ArbitrageService {

	constructor(bridgeService, walletContainer) {
		this._bridgeService = bridgeService;
		this._databaseService = DataBaseService;
		this._evaluationService = new EvaluationService(this._databaseService);

		this._ethContracts = new Contracts("ETH", walletContainer.ArbitrageWalletETH);
		this._bscContracts = new Contracts("BSC", walletContainer.ArbitrageWalletBSC);

		this._isRunning = false;
		this._stopCycle = false;
	}

	async startArbitrage() {
		if (!this._isRunning) {
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
				if (this._stopCycle) {
					return false;
				}

				poolPriceBsc = await this._bscContracts.getPoolPrice();
				poolPriceEth = await this._ethContracts.getPoolPrice();
			}

			this._isRunning = false;
		}
	}


	async startSingleArbitrageCycle() {
		let poolPriceBsc = await this._bscContracts.getPoolPrice();
		let poolPriceEth = await this._ethContracts.getPoolPrice();
		await this._startArbitrageCycle(poolPriceBsc, poolPriceEth);
	}

	async _startArbitrageCycle(poolPriceBsc, poolPriceEth) {
		let totalPoolBlxmBSC = await this._bscContracts.getPoolNumberOfBlxmToken();
		let totalPoolUsdcBSC = await this._bscContracts.getPoolNumberOfUsdToken();
		let totalPoolBlxmETH = await this._ethContracts.getPoolNumberOfBlxmToken();
		let totalPoolUsdcETH = await this._ethContracts.getPoolNumberOfUsdToken();

		let totalArbitrageBlxmBsc = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
		let totalArbitrageBlxmEth = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
		let totalArbitrageUsdcBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
		let totalArbitrageUsdcEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

		// TODO: use response from startArbitrageTransferFromEthToBsc (result) to calculate profit, workaround because value is null
		let preUsdBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
		let preUsdBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

		let adjustmentValue;
		let adjustmentValueUsd;
		let result;
		let poolPriceDifference = ethers.utils.formatEther(poolPriceEth) - ethers.utils.formatEther(poolPriceBsc);
		let minimumSwapAmountValue = await this._evaluationService.minimumSwapAmount(poolPriceBsc, poolPriceEth, totalArbitrageBlxmEth, totalArbitrageBlxmBsc, totalArbitrageUsdcEth, totalArbitrageUsdcBsc);

		if (poolPriceBsc.gt(poolPriceEth)) {
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(totalPoolBlxmETH, totalPoolUsdcETH, totalPoolBlxmBSC, totalPoolUsdcBSC);
			adjustmentValueUsd = AdjustmentValueService.getAdjustmentValueUsd(totalPoolBlxmETH, totalPoolUsdcETH, totalPoolBlxmBSC, totalPoolUsdcBSC);

			logger.info("ETH < BSC: The BLXM token trades cheaper on the ETH network than on the BSC network. Price difference between the networks: " + Math.abs(poolPriceDifference) + " USD");

			result = await this.startArbitrageTransferFromEthToBsc(adjustmentValue, adjustmentValueUsd, totalArbitrageBlxmEth, totalArbitrageUsdcEth, totalArbitrageUsdcBsc, totalPoolUsdcBSC, minimumSwapAmountValue);

			// cancel cycle
			if (result === -1) {
				return;
			}

			// TODO: use response from startArbitrageTransferFromEthToBsc (result), workaround because value is null
			let postUsdBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			let profit = ethers.utils.formatEther(postUsdBalanceBsc) - ethers.utils.formatEther(preUsdBalanceBsc);
			let absoluteProfit = await this._calculateAbitrageProfit(result.swapAmount, poolPriceEth, profit);

			await this._databaseService.AddData({ "profit": absoluteProfit, "network": "BSC", "isArbitrageSwap": true }, Profit);
		}
		else {
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(totalPoolBlxmBSC, totalPoolBlxmBSC, totalPoolBlxmETH, totalPoolUsdcETH);
			adjustmentValueUsd = AdjustmentValueService.getAdjustmentValueUsd(totalPoolBlxmBSC, totalPoolBlxmBSC, totalPoolBlxmETH, totalPoolUsdcETH);

			logger.info("BSC < ETH: The BLXM token trades cheaper on the BSC network than on the ETH network. Price difference between the networks: " + Math.abs(poolPriceDifference) + " USD");

			result = await this.startArbitrageTransferFromBscToEth(adjustmentValue, adjustmentValueUsd, totalArbitrageBlxmBsc, totalArbitrageUsdcEth, totalArbitrageUsdcBsc, totalPoolUsdcETH, minimumSwapAmountValue);

			// cancel cycle
			if (result === -1) {
				return;
			}

			// TODO: use response from startArbitrageTransferFromEthToBsc (result), workaround because value is null
			let postUsdBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			let profit = ethers.utils.formatEther(postUsdBalanceEth) - ethers.utils.formatEther(preUsdBalanceEth);
			let absoluteProfit = await this._calculateAbitrageProfit(result.swapAmount, poolPriceBsc, profit);

			await this._databaseService.AddData({ "profit": absoluteProfit, "network": "ETH", "isArbitrageSwap": true }, Profit);
		}
	}

	async startArbitrageTransferFromEthToBsc(adjustmentValue, adjustmentValueUSDC, totalArbitrageBlxmEth, totalArbitrageUsdcEth, totalArbitrageUsdcBsc, totalPoolUsdcEth, minimumSwapAmountValue) {
		// is liqudity available ? 
		if (!totalArbitrageBlxmEth.isZero()) {
			let totalAdjustmentValue = Utility.bigNumberMin(totalArbitrageBlxmEth, adjustmentValue);

			logger.info("ETH network: BLXM Liqudity available");
			logger.info("Liqudity of BLXM  in ETH: [" + ethers.utils.formatEther(totalArbitrageBlxmEth) + "]");

			logger.info("Adjustment value BLXM: " + ethers.utils.formatEther(adjustmentValue));

			if (minimumSwapAmountValue.minimumSwapAmountBLXM > ethers.utils.formatEther(totalAdjustmentValue)) {
				logger.warn("Minimum swap BLXM amount is less than the adjustment value. Canceling current cycle.");

				return -1;
			}

			return await this._bridgeAndSwapToBsc(totalAdjustmentValue);
		}

		// provide liqudity in eth
		// swap and bridge usd
		else {
			logger.warn("ETH network: Not enough BLXM liquidity available. Need to swap USDC from arbitrage Pool");
			logger.info("Adjustment value USD: " + ethers.utils.formatEther(adjustmentValueUSDC));

			if (totalPoolUsdcEth.isZero()) {
				logger.warn("Not enough usdc liquidity in BSC Pool. Need to stop the cycle.");
				this._stopCycle = true;

				return -1;
			}

			// find minimum of the adjustmentValue and pool usd balance
			let totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, totalPoolUsdcEth);

			if (totalArbitrageUsdcEth.isZero() && totalArbitrageUsdcBsc.isZero()) {
				logger.warn("Stopping the cycle not enough liquidty BLXM or USDC avaible.");
				this._stopCycle = true;

				return -1;
			}

			if (!totalArbitrageUsdcEth.isZero()) {
				totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, totalArbitrageUsdcEth);
			}

			// provide liquidity from expensive network via usd
			else if (!totalArbitrageUsdcBsc.isZero()) {
				// take minimum Usd in BSC, if arbitrage total of usd is not equals to adjustmentValueUSDC
				totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, totalArbitrageUsdcBsc);

				// bridge usdc from bsc to eth
				await this._bridgeService.bridgeUSDTokenBscToEth(totalAdjustmentValue);
			}

			if (minimumSwapAmountValue.minimumSwapAmountUSD > ethers.utils.formatEther(totalAdjustmentValue)) {
				logger.warn("Minimum swap USD amount is less than the adjustment value. Canceling current cycle.");

				return -1;
			}

			// swap from usd to blxm
			await this._ethContracts.poolContract.swapStablesToToken(totalAdjustmentValue);

			logger.info("ETH network: Swapped: [" + ethers.utils.formatEther(totalAdjustmentValue) + "] USDC to BLXM to aquire liquidity.");

			totalAdjustmentValue = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			return await this._bridgeAndSwapToBsc(totalAdjustmentValue);
		}
	}

	async startArbitrageTransferFromBscToEth(adjustmentValue, adjustmentValueUSDC, totalArbitrageBlxmBsc, totalArbitrageUsdcEth, totalArbitrageUsdcBsc, totalPoolUsdcBsc, minimumSwapAmountValue) {
		// is liqudity avaible ? 
		if (!totalArbitrageBlxmBsc.isZero()) {
			let totalAdjustmentValue = Utility.bigNumberMin(totalArbitrageBlxmBsc, adjustmentValue);

			logger.info("BSC network: Liqudity of BLXM for swap available");
			logger.info("BSC network: Liqudity amount of BLXM: [" + ethers.utils.formatEther(totalArbitrageBlxmBsc) + "]");
			logger.info("Adjustment value BLXM: " + ethers.utils.formatEther(adjustmentValue));

			if (minimumSwapAmountValue.minimumSwapAmountBLXM > ethers.utils.formatEther(totalAdjustmentValue)) {
				return -1;
			}

			return await this._bridgeAndSwapToEth(totalAdjustmentValue);
		}

		// provide liqudity in bsc
		// swap and bridge usd
		else {
			logger.warn("BSC network: Not enough BLXM liquidity available. Need to swap USDC from arbitrage Pool");
			logger.info("Adjustment value USD: " + ethers.utils.formatEther(adjustmentValueUSDC));

			if (totalPoolUsdcBsc.isZero()) {
				logger.warn("Not enough usdc liquidity in BSC Pool. Need to stop the cycle.");
				this._stopCycle = true;

				return -1;
			}

			// find minimum of the adjustmentValue and pool usd balance
			let totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, totalPoolUsdcBsc);

			if (totalArbitrageUsdcEth.isZero() && totalArbitrageUsdcBsc.isZero()) {
				logger.warn("Stopping the cycle not enough liquidty BLXM or USDC avaible.");
				this._stopCycle = true;

				return -1;
			}

			if (!totalArbitrageUsdcBsc.isZero()) {
				totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, totalArbitrageUsdcBsc);
			}

			// provide liquidity from expensive network via usd
			else if (!totalArbitrageUsdcEth.isZero()) {
				// take minimum Usd in ETH, if arbitrage total of usd is not equals to adjustmentValueUSDC
				totalAdjustmentValue = Utility.bigNumberMin(adjustmentValueUSDC, totalArbitrageUsdcEth);

				if (totalAdjustmentValue.gt(totalArbitrageUsdcEth)) {
					this._stopCycle = true;

					return -1;
				}

				// bridge usdc from eth to bsc
				await this._bridgeService.bridgeUSDTokenEthToBsc(totalAdjustmentValue);
			}


			if (minimumSwapAmountValue.minimumSwapAmountUSD > ethers.utils.formatEther(totalAdjustmentValue)) {
				logger.warn("Minimum swap USD amount is less than the adjustment value. Canceling current cycle.");

				return -1;
			}

			// swap from usd to blxm
			await this._bscContracts.poolContract.swapStablesToToken(totalAdjustmentValue);

			logger.info("BSC network: Swapped: [" + ethers.utils.formatEther(totalAdjustmentValue) + "] USDC to BLXM to aquire liquidity.");

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
}


module.exports = ArbitrageService;
