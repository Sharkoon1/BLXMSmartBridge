const constants = require("../constants");
const { ethers } = require("ethers");
const Utility = require("../helpers/utility");
const AdjustmentValueService = require("./AdjustmentValueService");
const Contracts  = require("../contracts/Contracts");
const DataBaseService = require("./DataBaseService");
class ArbitrageService {

	constructor(bridgeService, walletContainer) {
		this._swapTransferFunctionName = "Transfer";
		this._bridgeService = bridgeService;
		this._databaseService = new DataBaseService();
		

		this._ethContracts = new Contracts("ETH", walletContainer.ArbitrageWalletETH);
		this._bscContracts = new Contracts("BSC", walletContainer.ArbitrageWalletBSC);
	}

	async startArbitrage() {
		let poolPriceBsc = await this._bscContracts.getPoolPrice();
		let poolPriceEth = await this._ethContracts.getPoolPrice();
		while (!poolPriceBsc.eq(poolPriceEth)) {
			await this._startArbitrageCycle(poolPriceBsc, poolPriceEth);
			poolPriceBsc = await this._bscContracts.getPoolPrice();
			poolPriceEth = await this._ethContracts.getPoolPrice();
		}
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

		if (poolPriceBsc.gt(poolPriceEth)) {
			arbitrageBlxmBalance = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmETH, balanceUsdcETH, balanceBlxmBSC, balanceUsdcBSC);

			result = await this.startArbitrageTransferFromBSCToETH(adjustmentValue, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdcETH);
		    profit = this._calculateAbitrageProfit(result.swapAmount, balanceBlxmETH, balanceBlxmBSC, result.profit, "ETH");
		} 
		else {
			arbitrageBlxmBalance = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmBSC, balanceUsdcBSC, balanceBlxmETH, balanceUsdcETH);

			result = await this.startArbitrageTransferFromETHToBSC(adjustmentValue, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdcETH);
			profit = this._calculateAbitrageProfit(result.swapAmount, balanceBlxmBSC, balanceBlxmETH, result.profit, "BSC");
		}

		this._databaseService.AddData({Profit: profit});
	}

	async startArbitrageTransferFromBSCToETH(amount, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdc) {
		// is liqudity available ? 
		if (!arbitrageBlxmBalance.isZero()) {

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
				// cheap network    
				let usdcAmount = poolPriceEth.mul(amount);
				usdcSwapAmount = Utility.BigNumberMin(usdcAmount, balanceUsdc);
			}

			// provide liquidity from expensive network via usd
			else if (!arbitrageUsdcBalanceBsc.isZero()) {
				// expensive network     
				let usdcAmount = poolPriceBsc.mul(amount);
				usdcSwapAmount = Utility.BigNumberMin(usdcAmount, balanceUsdc);

				// bridge usdc from bsc to eth
				await this._bridgeService.bridgeUSDTokenBSC(usdcSwapAmount);
			}
			// swap from usd to blxm
			await this._ethContracts.poolContract.swapStablesToToken(usdcSwapAmount);

			arbitrageBlxmBalance = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			return await this._bridgeAndSwapBSC(amount, arbitrageBlxmBalance);
		}
	}

	async startArbitrageTransferFromETHToBSC(amount, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdc) {
		// is liqudity avaible ? 
		if (!arbitrageBlxmBalance.isZero()) {
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
				// cheap network    
				let usdcAmount = poolPriceBsc.mul(amount);

				usdSwapAmount = Utility.BigNumberMin(usdcAmount, balanceUsdc);
			}

			// provide liquidity from expensive network via usd
			else if (!arbitrageUsdcBalanceEth.isZero()) {
				// expensive network                         
				let usdcAmount = poolPriceEth.mul(amount);

				usdSwapAmount = Utility.BigNumberMin(usdcAmount, balanceUsdc);

				// bridge usdc from eth to bsc
				await this._bridgeService.bridgeUSDTokenETH(usdSwapAmount);
			}

			// swap usd from bsc to blxm
			await this._bscContracts.poolContract.swapStablesToToken(usdSwapAmount);

			arbitrageBlxmBalance = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			return await this._bridgeAndSwapETH(amount, arbitrageBlxmBalance);
		}
	}

	async _bridgeAndSwapETH(amount, abitrageBalance) {
		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Utility.BigNumberMin(amount, abitrageBalance);

		// bridge blxm tokens
		await this._bridgeService.bridgeBLXMTokenBscToEth(swapAmount);

		let profit = await this._ethContracts.poolContract.swapTokenToStables(swapAmount);

		return { profit: profit, swapAmount: swapAmount };
	}

	async _bridgeAndSwapBSC(amount, abitrageBalance) {
		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Utility.BigNumberMin(amount, abitrageBalance);

		// bridge blxm tokens
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

		let poolPriceBsc = ethers.utils.formatEther(await this._bscContracts.getPoolPrice());
		let poolPriceEth = ethers.utils.formatEther(await this._ethContracts.getPoolPrice());
		let	arbitrageBlxmBalanceEth = ethers.utils.formatEther(await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS));
		let	arbitrageBlxmBalanceBsc = ethers.utils.formatEther(await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS));

		//Calculate the loss that happens because of changed price in our abitrage wallet 
		if (network === "BSC") {
			capitalLoss = (startPriceExpensiveBLXM - poolPriceBsc) * arbitrageBlxmBalanceBsc;
		} else {
			capitalLoss = (startPriceExpensiveBLXM - poolPriceEth) * arbitrageBlxmBalanceEth;
		}

		let absoluteAbitrageProfit = usdcProfit - inputFactor - capitalLoss;

		return absoluteAbitrageProfit;
	}
}


module.exports = ArbitrageService;
