const constants = require("../constants");
const Utility = require("../helpers/utility");
const AdjustmentValueService = require("./AdjustmentValueService");
const Contracts  = require("../contracts/Contracts");

class ArbitrageService {

	constructor(bridgeService, walletContainer) {
		this._swapTransferFunctionName = "Transfer";
		this._bridgeService = bridgeService;
		

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
		if (poolPriceBsc.gt(poolPriceEth)) {
			arbitrageBlxmBalance = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmETH, balanceUsdcETH, balanceBlxmBSC, balanceUsdcBSC);

			await this.startArbitrageTransferFromBSCToETH(adjustmentValue, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdcETH);
		} else {
			arbitrageBlxmBalance = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmBSC, balanceUsdcBSC, balanceBlxmETH, balanceUsdcETH);

			await this.startArbitrageTransferFromETHToBSC(adjustmentValue, arbitrageBlxmBalance, poolPriceBsc, poolPriceEth, balanceUsdcETH);
		}
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
			await this._bridgeAndSwapETH(amount, arbitrageBlxmBalance);
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

			await this._bridgeAndSwapETH(amount, arbitrageBlxmBalance);
		}
	}

	async _bridgeAndSwapETH(amount, abitrageBalance) {
		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Utility.BigNumberMin(amount, abitrageBalance);

		// bridge blxm tokens
		await this._bridgeService.bridgeBLXMTokenBscToEth(swapAmount);

		await this._ethContracts.poolContract.swapTokenToStables(swapAmount);
	}

	async _bridgeAndSwapBSC(amount, abitrageBalance) {
		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Utility.BigNumberMin(amount, abitrageBalance);

		// bridge blxm tokens
		await this._bridgeService.bridgeBLXMTokenEthToBsc(swapAmount);

		await this._bscContracts.poolContract.swapTokenToStables(swapAmount);
	}

	calculateAbitrageProfit(swapAmount_blxm, startPrice_cheap_BLXM, startPrice_expensive_BLXM, usdcProfit, swapTo) {

		let capital_loss = 0;

		//Calculate how much the abitrage costs us 
		let input_factor = swapAmount_blxm * startPrice_cheap_BLXM; //Cheap BLXM

		//Calculate the loss that happens because of changed price in our abitrage wallet 
		if (swapTo === "BSC") {
			capital_loss = (startPrice_expensive_BLXM - this.getPoolPriceBSC()) * this.getArbitrageBalanceBlxmBSC();
		} else {
			capital_loss = (startPrice_expensive_BLXM - this.getPoolPriceETH()) * this.getArbitrageBalanceBlxmETH();
		}

		let absolute_abitrage_profit = usdcProfit - input_factor - capital_loss;

		return absolute_abitrage_profit;
	}
}


module.exports = ArbitrageService;
