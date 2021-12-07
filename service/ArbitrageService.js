const logger = require("../logger/logger");
const constants = require("../constants");
const { ethers } = require("ethers");
const Utility = require("../helpers/utility");
const AdjustmentValueService = require("./AdjustmentValueService");
const Contracts = require("../contracts/Contracts");
const DataBaseService = require("./DataBaseService");

class ArbitrageService {

	constructor(bridgeService, walletContainer) {
		this._swapTransferFunctionName = "Transfer";
		this._bridgeService = bridgeService;
		//	this._databaseService = new DataBaseService();
		

		this._ethContracts = new Contracts("ETH", walletContainer.ArbitrageWalletETH);
		this._bscContracts = new Contracts("BSC", walletContainer.ArbitrageWalletBSC);

		this._isRunning = true;
	}

	async startArbitrage() {
		if(!this._isRunning) {
			logger.info("Start AbitrageService ...");
			let poolPriceBsc = await this._bscContracts.getPoolPrice();
			let poolPriceEth = await this._ethContracts.getPoolPrice();
	
			while (poolPriceBsc > poolPriceEth) {
				
				logger.info("Abitrage opportunity found " + "\n" +
							"Current price BLXM Ethereum network " + poolPriceEth + " USD" + "\n" +
							"Current price BLXM Binance Smart Chain network" + poolPriceBsc + " USD");
	
				await this._startArbitrageCycle(poolPriceBsc, poolPriceEth);
				poolPriceBsc = await this._bscContracts.getPoolPrice();
				poolPriceEth = await this._ethContracts.getPoolPrice();
			}
		}

		this._isRunning = false;
	}

	async _startArbitrageCycle(poolPriceBsc, poolPriceEth) {

		let balanceBlxmBSC = await this._bscContracts.getPoolNumberOfBlxmToken();
		let balanceUsdcBSC = await this._bscContracts.getPoolNumberOfUsdToken();
		let balanceBlxmETH = await this._ethContracts.getPoolNumberOfBlxmToken();
		let balanceUsdcETH = await this._ethContracts.getPoolNumberOfUsdToken();

		let adjustmentValue;
		let arbitrageBlxmBalance;
		let result;
		let profit;

		if (poolPriceBsc > poolPriceEth) {
			arbitrageBlxmBalance = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmETH, balanceUsdcETH, balanceBlxmBSC, balanceUsdcBSC);

			logger.info("The BLXM token trades cheaper on the Ethereum network than Binance Smart Chain network " +
				"Price difference: " + poolPriceBsc - poolPriceEth + " USD");

			result = await this.startArbitrageTransferFromBSCToETH(adjustmentValue, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdcETH);
			profit = this._calculateAbitrageProfit(result.swapAmount, balanceBlxmETH, balanceBlxmBSC, result.profit, "ETH");
		}
		else {
			arbitrageBlxmBalance = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmBSC, balanceUsdcBSC, balanceBlxmETH, balanceUsdcETH);

			logger.info("The BLXM token trades cheaper on the Binance Smart Chain network than Ethereum network" +
				"Price difference: " + poolPriceEth - poolPriceBsc + " USD");

			result = await this.startArbitrageTransferFromETHToBSC(adjustmentValue, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdcETH);
			profit = this._calculateAbitrageProfit(result.swapAmount, balanceBlxmBSC, balanceBlxmETH, result.profit, "BSC");
		}

		//this._databaseService.AddData({Profit: profit});
	}

	async startArbitrageTransferFromBSCToETH(amount, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdc) {

		// is liqudity available ? 
		if (!arbitrageBlxmBalance.isZero()) {
			logger.info("Liqudity of BLXM in the Binance Smart Chain network available. " +
				"Going to perform the swap directly with available BLXM balance of " + ethers.utils.formatEther(amount) + " BLXM");

			return await this._bridgeAndSwapBSC(amount, arbitrageBlxmBalance);
		}

		// provide liqudity in bsc
		// swap and bridge usd
		else {
			let arbitrageUsdcBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let arbitrageUsdcBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let usdcSwapAmount = 0;

			// provide liquidity from cheap network via usd
			if (!arbitrageUsdcBalanceEth.isZero()) {
				logger.info("Going to swap USDC from Ethereum network to BLXM in Ethereum network to perform arbitrage trade");
				// cheap network    
				let usdcAmount = poolPriceEth.mul(amount);
				usdcSwapAmount = Utility.BigNumberMin(usdcAmount, balanceUsdc);
			}

			// provide liquidity from expensive network via usd
			else if (!arbitrageUsdcBalanceBsc.isZero()) {
				logger.warn("Liqudity of USDC in the Binance Smart Chain network to swap to BLXM in the Binance Smart Chain network available");

				// expensive network     
				let usdcAmount = poolPriceBsc.mul(amount);
				usdcSwapAmount = Utility.BigNumberMin(usdcAmount, balanceUsdc);

				// bridge usdc from bsc to eth
				await this._bridgeService.bridgeUSDTokenBSC(usdcSwapAmount);
				logger.info("Going to bridge USDC from the Ethereum network to the Binance Smart Chain network to have liquidity in Binance Smart Chain to perform arbitrage trade");
			}
			// swap from usd to blxm
			await this._ethContracts.poolContract.swapStablesToToken(usdcSwapAmount);
			logger.info("Swap " + ethers.utils.formatEther(usdcSwapAmount) + " USDC to BLXM in the Binance Smart Chain Network to perform arbitrage trade");

			arbitrageBlxmBalance = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			logger.info("Add BLXM to the liquidity pool to complete arbitrage cycle");
			return await this._bridgeAndSwapBSC(amount, arbitrageBlxmBalance);
		}
	}

	async startArbitrageTransferFromETHToBSC(amount, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdc) {
		// is liqudity avaible ? 
		if (!arbitrageBlxmBalance.isZero()) {
			logger.info("Liqudity of BLXM in the Ethereum for swap available" +
				"Going to perform the swap directly with available BLXM balance of " + ethers.utils.formatEther(amount) + " BLXM");

			return await this._bridgeAndSwapETH(amount, arbitrageBlxmBalance);
		}

		// provide liqudity in bsc
		// swap and bridge usd
		else {
			let arbitrageUsdcBalanceBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let arbitrageUsdcBalanceEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let usdSwapAmount = 0;

			// provide liquidity from cheap network via usd
			if (!arbitrageUsdcBalanceBsc.isZero()) {
				logger.info("Going to swap USDC from Ethereum network to BLXM in the Ethereum network to perform arbitrage trade");
				// cheap network    
				let usdcAmount = poolPriceBsc.mul(amount);

				usdSwapAmount = Utility.BigNumberMin(usdcAmount, balanceUsdc);
			}

			// provide liquidity from expensive network via usd
			else if (!arbitrageUsdcBalanceEth.isZero()) {
				logger.warn("Liqudity of USDC in the Binance Smart Chain network to swap to BLXM in the Binance Smart Chain network available");

				// expensive network                         
				let usdcAmount = poolPriceEth.mul(amount);

				usdSwapAmount = Utility.BigNumberMin(usdcAmount, balanceUsdc);

				// bridge usdc from eth to bsc
				await this._bridgeService.bridgeUSDTokenETH(usdSwapAmount);
			}

			// swap usd from bsc to blxm
			await this._bscContracts.poolContract.swapStablesToToken(usdSwapAmount);
			logger.info("Swap " + ethers.utils.formatEther(usdSwapAmount) + " USDC to BLXM in the Binance Smart Chain Network to perform arbitrage trade");

			arbitrageBlxmBalance = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			logger.info("Add BLXM to the liquidity pool to complete arbitrage cycle");
			return await this._bridgeAndSwapETH(amount, arbitrageBlxmBalance);
		}
	}

	async _bridgeAndSwapETH(amount, abitrageBalance) {
		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Utility.BigNumberMin(amount, abitrageBalance);
		logger.info("Swapping " + ethers.utils.formatEther(swapAmount) + " USDC to BLXM to perform arbitrage trade");

		// bridge blxm tokens
		logger.info("Bridging " + ethers.utils.formatEther(swapAmount) + " BLXM from Ethereum network to Binance Smart Chain network");
		await this._bridgeService.bridgeBLXMTokenBscToEth(swapAmount);

		let profit = await this._ethContracts.poolContract.swapTokenToStables(swapAmount);

		return { profit: profit, swapAmount: swapAmount };
	}

	async _bridgeAndSwapBSC(amount, abitrageBalance) {
		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Utility.BigNumberMin(amount, abitrageBalance);
		logger.info("Swapping " + ethers.utils.formatEther(swapAmount) + " USDC to BLXM to perform arbitrage trade");

		// bridge blxm tokens
		logger.info("Bridging " + ethers.utils.formatEther(swapAmount) + " BLXM from Binance Smart Chain network to Ethereum network");
		await this._bridgeService.bridgeBLXMTokenEthToBsc(swapAmount);

		let profit = this._bscContracts.poolContract.swapTokenToStables(swapAmount);

		return { profit: profit, swapAmount: swapAmount };
	}

	async _calculateAbitrageProfit(swapAmountBlxm, startPriceCheapBLXM, startPriceExpensiveBLXM, usdcProfit, network) {
		let capitalLoss;
		swapAmountBlxm = ethers.utils.formatEther(swapAmountBlxm);
		startPriceCheapBLXM = ethers.utils.formatEther(startPriceCheapBLXM);
		startPriceExpensiveBLXM = ethers.utils.formatEther(startPriceExpensiveBLXM);
		usdcProfit = ethers.utils.formatEther(usdcProfit);

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

		let absoluteAbitrageProfit = usdcProfit - inputFactor - capitalLoss;

		logger.verbose("The abitrage trade made in sum " + ethers.utils.formatEther(absoluteAbitrageProfit) + " USD absolute profit");
		logger.info(" =    " + "USD profit:   " + ethers.utils.formatEther(usdcProfit) + " USD" + "\n" +
			" -    " + "Input factor: " + ethers.utils.formatEther(inputFactor) + " USD" + "\n" +
			" -    " + "Capital loss: " + ethers.utils.formatEther(capitalLoss) + " USD" + "\n");

		return absoluteAbitrageProfit;
	}
}


module.exports = ArbitrageService;
