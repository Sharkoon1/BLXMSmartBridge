const logger = require("../logger/logger");
const constants = require("../constants");
const { ethers } = require("ethers");
const Utility = require("../helpers/utility");
const AdjustmentValueService = require("./AdjustmentValueService");
const Contracts = require("../contracts/Contracts");
//const DataBaseService = require("./DataBaseService");

class ArbitrageService {

	constructor(bridgeService, walletContainer) {
		this._swapTransferFunctionName = "Transfer";
		this._bridgeService = bridgeService;
		//	this._databaseService = new DataBaseService();
		

		this._ethContracts = new Contracts("ETH", walletContainer.ArbitrageWalletETH);
		this._bscContracts = new Contracts("BSC", walletContainer.ArbitrageWalletBSC);

		this._isRunning = false;
	}

	async startArbitrage() {
		if(!this._isRunning) {
			this._isRunning = true;

			logger.info("Start AbitrageService ...");
			let poolPriceBsc = await this._bscContracts.getPoolPrice();
			let poolPriceEth = await this._ethContracts.getPoolPrice();
	
			while (!poolPriceBsc.eq(poolPriceEth)) {
				
				logger.info("Abitrage opportunity found " + "\n" +
							"Current price BLXM Ethereum network " + ethers.utils.formatEther(poolPriceEth) + " USD" + "\n" +
							"Current price BLXM Binance Smart Chain network " + ethers.utils.formatEther(poolPriceBsc) + " USD");
	
				await this._startArbitrageCycle(poolPriceBsc, poolPriceEth);
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
		let arbitrageBlxmBalance;
		let result;
		let absoluteProfit;
		let poolPriceDifference = ethers.utils.formatEther(poolPriceEth) - ethers.utils.formatEther(poolPriceBsc);

		if (poolPriceBsc.gt(poolPriceEth)) {
			arbitrageBlxmBalance = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmETH, balanceUsdcETH, balanceBlxmBSC, balanceUsdcBSC);

			logger.info("The BLXM is cheaper in  BSC. Price difference between the networks: " + poolPriceDifference);

			result = await this.startArbitrageTransferFromEthToBsc(adjustmentValue, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdcETH);

			// TODO: use response from startArbitrageTransferFromEthToBsc (result), workaround because value is null
			let postUsdBalanceBsc = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			let profit = ethers.utils.formatEther(postUsdBalanceBsc) - ethers.utils.formatEther(preUsdBalanceBsc);
			
			absoluteProfit = this._calculateAbitrageProfit(result.swapAmount, balanceBlxmETH, balanceBlxmBSC, profit, "ETH");
		}
		else {
			arbitrageBlxmBalance = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmBSC, balanceUsdcBSC, balanceBlxmETH, balanceUsdcETH);


			logger.info("The BLXM is cheaper in ETH. Price difference between the networks: " + poolPriceDifference);

			result = await this.startArbitrageTransferFromBscToEth(adjustmentValue, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdcETH);

			// TODO: use response from startArbitrageTransferFromEthToBsc (result), workaround because value is null
			let postUsdBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			let profit = ethers.utils.formatEther(postUsdBalanceEth) - ethers.utils.formatEther(preUsdBalanceEth);
					
			absoluteProfit = this._calculateAbitrageProfit(result.swapAmount, balanceBlxmBSC, balanceBlxmETH, profit, "BSC");
		}

		//this._databaseService.AddData({Profit: profit});
	}

	async startArbitrageTransferFromEthToBsc(amount, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdc) {
		// is liqudity available ? 
		if (!arbitrageBlxmBalance.isZero()) {
			logger.info("Liqudity of BLXM in ETH available.");

			return await this._bridgeAndSwapToBsc(amount, arbitrageBlxmBalance);
		}

		// provide liqudity in bsc
		// swap and bridge usd
		else {
			let arbitrageUsdcBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let arbitrageUsdcBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let usdcSwapAmount = 0;

			// provide liquidity from cheap network via usd
			if (!arbitrageUsdcBalanceEth.isZero()) {
				// cheap network    
				let usdcAmount = Utility.bigNumberMul(poolPriceEth, amount); 
				usdcSwapAmount = Utility.bigNumberMin(usdcAmount, balanceUsdc);
			}

			// provide liquidity from expensive network via usd
			else if (!arbitrageUsdcBalanceBsc.isZero()) {
				// expensive network     
				let usdcAmount = Utility.bigNumberMul(poolPriceBsc, amount); 
				usdcSwapAmount = Utility.bigNumberMin(usdcAmount, balanceUsdc);

				// bridge usdc from bsc to eth
				await this._bridgeService.bridgeUSDTokenBSC(usdcSwapAmount);
			}

			// swap from usd to blxm
			await this._ethContracts.poolContract.swapStablesToToken(usdcSwapAmount);


			logger.info("Swapped " + ethers.utils.formatEther(usdcSwapAmount) + " USDC to BLXM in ETH to aquire liquidity.");

			arbitrageBlxmBalance = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			return await this._bridgeAndSwapToBsc(amount, arbitrageBlxmBalance);
		}
	}

	async startArbitrageTransferFromBscToEth(amount, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdc) {
		// is liqudity avaible ? 
		if (!arbitrageBlxmBalance.isZero()) {
			logger.info("Liqudity of BLXM in BSC for swap available");

			return await this._bridgeAndSwapToEth(amount, arbitrageBlxmBalance);
		}

		// provide liqudity in bsc
		// swap and bridge usd
		else {
			logger.warning("Not enough blxm liqudity in bsc, need to swap usdc");

			let arbitrageUsdcBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let arbitrageUsdcBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let usdSwapAmount = 0;

			// provide liquidity from cheap network via usd
			if (!arbitrageUsdcBalanceBsc.isZero()) {

				// cheap network    
				let usdcAmount = Utility.bigNumberMul(poolPriceBsc, amount);

				usdSwapAmount = Utility.bigNumberMin(usdcAmount, balanceUsdc);
			}

			// provide liquidity from expensive network via usd
			else if (!arbitrageUsdcBalanceEth.isZero()) {
				// expensive network                         
				let usdcAmount = Utility.bigNumberMul(poolPriceEth, amount);

				usdSwapAmount = Utility.bigNumberMin(usdcAmount, balanceUsdc);

				// bridge usdc from eth to bsc
				await this._bridgeService.bridgeUSDTokenETH(usdSwapAmount);
			}

			// swap usd from bsc to blxm
			await this._bscContracts.poolContract.swapStablesToToken(usdSwapAmount);

			logger.info("Swapped " + ethers.utils.formatEther(usdSwapAmount) + " USDC to BLXM in BSC to aquire liquidity.");

			arbitrageBlxmBalance = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			return await this._bridgeAndSwapToEth(amount, arbitrageBlxmBalance);
		}
	}

	async _bridgeAndSwapToEth(amount, abitrageBalance) {
		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Utility.bigNumberMin(amount, abitrageBalance);

		// bridge blxm tokens
		logger.info("Bridging " + ethers.utils.formatEther(swapAmount) + " BLXM from ETH to BSC.");
		await this._bridgeService.bridgeBLXMTokenBscToEth(swapAmount);

		logger.info("Swapping " + ethers.utils.formatEther(swapAmount) + " BLXM to USDC in ETH.");
		let profit = await this._ethContracts.poolContract.swapTokenToStables(swapAmount);

		return { profit: profit, swapAmount: swapAmount };
	}

	async _bridgeAndSwapToBsc(amount, abitrageBalance) {
		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Utility.bigNumberMin(amount, abitrageBalance);

		// bridge blxm tokens
		logger.info("Bridging " + ethers.utils.formatEther(swapAmount) + " BLXM from BSC to ETH.");
		await this._bridgeService.bridgeBLXMTokenEthToBsc(swapAmount);

		logger.info("Swapping " + ethers.utils.formatEther(swapAmount) + " BLXM to USDC in ETH.");
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

		let poolPriceBsc = await this._bscContracts.getPoolPrice();
		let poolPriceEth = await this._ethContracts.getPoolPrice();
		let arbitrageBlxmBalanceEth = ethers.utils.formatEther(await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS));
		let arbitrageBlxmBalanceBsc = ethers.utils.formatEther(await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS));

		//Calculate the loss that happens because of changed price in our abitrage wallet 
		if (network === "BSC") {
			capitalLoss = (startPriceExpensiveBLXM - poolPriceBsc) * arbitrageBlxmBalanceBsc;
		} else {
			capitalLoss = (startPriceExpensiveBLXM - poolPriceEth) * arbitrageBlxmBalanceEth;
		}

		let absoluteAbitrageProfit = profit - inputFactor - capitalLoss;

		logger.verbose("The abitrage trade made in sum " + absoluteAbitrageProfit + " USD absolute profit");
		logger.info(" =    " + "USD profit:   " + profit + " USD" + "\n" +
			" -    " + "Input factor: " + inputFactor + " USD" + "\n" +
			" -    " + "Capital loss: " + capitalLoss+ " USD" + "\n");

		return absoluteAbitrageProfit;
	}
}


module.exports = ArbitrageService;
