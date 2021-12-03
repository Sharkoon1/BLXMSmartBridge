const { ethers } = require("ethers");
const __path = require("path");
const constants = require("../constants");
const AdjustmentValueService = require("./AdjustmentValueService");
const Utility = require("../helpers/utility");
const Wallets = require("../wallet/Wallets");

class ArbitrageService {

	constructor(bridgeService) {
		this._swapTransferFunctionName = "Transfer";
		this._bridgeService = bridgeService;
		this._ethContracts = new Contracts("ETH");
		this._bscContracts = new Contracts("BSC");
	}


	async startArbitrage() {
		let poolPriceBsc = await this._bscContracts.getPoolPrice();
		let poolPriceEth = await this._ethContracts.getPoolPrice();
		while (poolPriceBsc !== poolPriceEth) {
			await this._startArbitrageCycle(poolPriceBsc, poolPriceEth);
		}
	}

	async _startArbitrageCycle(poolPriceBsc, poolPriceEth) {

		let balanceBlxmBSC = await this._bscContracts.getPoolNumberOfBlxmToken();
		let balanceUsdcBSC = await this._bscContracts.getPoolNumberOfUsdToken();
		let balanceBlxmETH = await this._ethContracts.getPoolNumberOfBlxmToken();
		let balanceUsdcETH = await this._ethContracts.getPoolNumberOfUsdToken();
		let adjustmentValue;
		let arbitrageBalance;
		if (poolPriceBsc > poolPriceEth) {
			arbitrageBalance = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmETH, balanceUsdcETH, balanceBlxmBSC, balanceUsdcBSC);
		} else {
			arbitrageBalance = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmBSC, balanceUsdcBSC, balanceBlxmETH, balanceUsdcETH);
		}

		console.log("Adjustment value: " + adjustmentValue);
		await this.startArbitrageTransferFromBSCToETH(adjustmentValue, arbitrageBalance, pool_price_bsc, pool_price_eth, balanceUsdcETH);

	}

	async startArbitrageTransferFromBSCToETH(amount, balance, pool_price_bsc, pool_price_eth, balanceUsdcETH) {
		// is liqudity available ? 
		if (balance > 0) {

			console.log("liquidity available, starting to bridge and swap.");

			await this._bridgeAndSwapBSC(amount, balance);
		}

		// provide liqudity in bsc
		// swap and bridge usd
		else {
			console.log("liquidity available, starting to bridge and swap.");

			let arbitrage_balance_usd_bsc = await this.getArbitrageBalanceUSDBSC();
			let arbitrage_balance_usd_eth = await this.getArbitrageBalanceUSDETH();

			// provide liquidity from cheap network via usd
			if (arbitrage_balance_usd_eth > 0) {
				// cheap network    
				let usd_amount = pool_price_eth * amount;

				// swap exact amount or leftover usd in liquidity pool
				let usdSwapAmount = Math.min(usd_amount, balanceUsdcETH);

				// swap from bsc usd to bsc blxm
				await this._swapStablesToToken_BSC(usdSwapAmount);
			}

			// provide liquidity from expensive network via usd
			else if (arbitrage_balance_usd_bsc > 0) {
				// expensive network     
				let usd_amount = pool_price_bsc * amount;
				let usdSwapAmount = Math.min(usd_amount, balanceUsdcETH);

				// bridge usdc from bsc to eth
				await this.BridgeService.swapUSDTokenBSC(usdSwapAmount);

				// swap from eth usd to eth blxm
				await this._swapStablesToToken_ETH(usdSwapAmount);
			}

			balance = this.getArbitrageBalanceBlxmBSC();

			await this._bridgeAndSwapBSC(amount, balance);
		}
	}

	async isPriceEqual() {
		let newPoolPriceBsc = await this._bscContracts.getPoolPrice();
		let newPoolPriceEth = await this._ethContracts.getPoolPrice();

		console.log("Price after cycle in eth: " + newPoolPriceEth);
		console.log("Price after cycle in bsc: " + newPoolPriceBsc);

		return newPoolPriceBsc === newPoolPriceEth;
	}


	async _startArbitrageCycleETH() {
		let pool_price_bsc = await this.getPoolPriceBSC();
		let pool_price_eth = await this.getPoolPriceETH();

		console.log("ETH network price: " + pool_price_eth);
		console.log("BSC network price: " + pool_price_eth);

		if (pool_price_bsc < pool_price_eth) {
			let arbitrage_balance_blxm_bsc = await this.getArbitrageBalanceBlxmBSC();

			let balanceBlxmBSC = await this.getPoolBalanceBlxmBSC();
			let balanceUsdcBSC = await this.getPoolBalanceUSDBSC();
			let balanceBlxmETH = await this.getPoolBalanceBlxmETH();
			let balanceUsdcETH = await this.getPoolBalanceUSDETH();

			let adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmBSC, balanceUsdcBSC, balanceBlxmETH, balanceUsdcETH);

			console.log("Adjustment value: " + adjustmentValue);
			await this.startArbitrageTransferFromETHToBSC(adjustmentValue, arbitrage_balance_blxm_bsc, pool_price_bsc, pool_price_eth, balanceUsdcBSC);
		}
	}


	async startArbitrageTransferFromETHToBSC(amount, balance, pool_price_bsc, pool_price_eth, balanceUsdcBSC) {
		// Start transfer towards BSC network
		// is liqudity avaible ? 
		if (balance > 0) {
			console.log("liquidity available, starting to bridge and swap.");
			await this._bridgeAndSwapETH(amount, balance);
		}

		// provide liqudity in bsc
		// swap and bridge usd
		else {
			console.log("liquidity available, starting to bridge and swap.");

			let arbitrage_balance_usd_bsc = await this.getArbitrageBalanceUSDBSC();
			let arbitrage_balance_usd_eth = await this.getArbitrageBalanceUSDETH();

			// provide liquidity from cheap network via usd
			if (arbitrage_balance_usd_bsc > 0) {
				// cheap network    
				let usd_amount = pool_price_bsc * amount;
				let usdSwapAmount = Math.min(usd_amount, balanceUsdcBSC);

				// swap in bsc usd to blxm
				await this._swapStablesToToken_BSC(usdSwapAmount);
			}

			// provide liquidity from expensive network via usd
			else if (arbitrage_balance_usd_eth > 0) {
				// expensive network                         
				let usd_amount = pool_price_eth * amount;
				let usdSwapAmount = Math.min(usd_amount, balanceUsdcBSC);

				// bridge usdc from eth to bsc
				await this.BridgeService.swapUSDTokenETH(usdSwapAmount);

				// swap usd from bsc to blxm
				await this._swapStablesToToken_ETH(usdSwapAmount);
			}

			balance = await this.getArbitrageBalanceBlxmBSC();

			await this._bridgeAndSwapETH(amount, balance);
		}
	}

	async _bridgeAndSwapETH(amount, abitrageBalance) {
		// bridge result
		let bridgeResult = await this.BridgeService.swapBLXMTokenBscToEth(amount);

		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Math.min(amount, abitrageBalance);

		console.log("Amount to swap on liquidity pool: " + swapAmount);

		await this._swapTokenToStables_ETH(swapAmount);
	}

	async _bridgeAndSwapBSC(amount, abitrageBalance) {
		// bridge result
		let bridgeResult = await this.BridgeService.swapBLXMTokenEthToBsc(amount);

		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Math.min(amount, abitrageBalance);

		console.log("Amount to swap on liquidity pool: " + swapAmount);

		await this._swapTokenToStables_BSC(swapAmount);
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

	async getPoolBalanceBlxmBSC() {
		let balance = await this.contract_blxm_token_bsc.balanceOf(constants.POOL_ADDRESS_BSC);

		return ethers.utils.formatEther(balance);
	}
	async getPoolBalanceUSDBSC() {
		let balance = await this.contract_usd_token_bsc.balanceOf(constants.POOL_ADDRESS_BSC);

		return ethers.utils.formatEther(balance);
	}
	async getPoolBalanceBlxmETH() {
		let balance = await this.contract_blxm_token_eth.balanceOf(constants.POOL_ADDRESS_ETH);

		return ethers.utils.formatEther(balance);
	}
	async getPoolBalanceUSDETH() {
		let balance = await this.contract_usd_token_eth.balanceOf(constants.POOL_ADDRESS_ETH);

		return ethers.utils.formatEther(balance);
	}

	async getArbitrageBalanceBlxmETH() {
		let balance = await this.contract_blxm_token_eth.balanceOf(constants.ARBITRAGE_WALLET_ADDRESS);

		return ethers.utils.formatEther(balance);
	}

	async getArbitrageBalanceBlxmBSC() {
		let balance = await this.contract_blxm_token_bsc.balanceOf(constants.ARBITRAGE_WALLET_ADDRESS);

		return ethers.utils.formatEther(balance);
	}

	async getArbitrageBalanceUSDETH() {
		let balance = await this.contract_usd_token_eth.balanceOf(constants.ARBITRAGE_WALLET_ADDRESS);

		return ethers.utils.formatEther(balance);
	}

	async getArbitrageBalanceUSDBSC() {
		let balance = await this.contract_usd_token_bsc.balanceOf(constants.ARBITRAGE_WALLET_ADDRESS);

		return ethers.utils.formatEther(balance);
	}


	async _swapTokenToStables_BSC(amount) {
		return await this.contract_pool_bsc.tokenToStables(Utility.toWei(amount));
	}

	async _swapStablesToToken_BSC(amount) {
		return await this.contract_pool_bsc.tokenToStables(Utility.toWei(amount));
	}

	async _swapTokenToStables_ETH(amount) {
		return await this.contract_pool_eth.tokenToStables(Utility.toWei(amount));
	}

	async _swapStablesToToken_ETH(amount) {
		return await this.contract_pool_eth.tokenToStables(Utility.toWei(amount));
	}


	async getPoolPriceBSC() {
		let balanceWeiBlXM = await this.getPoolBalanceBlxmBSC();
		let balanceWeiUSD = await this.getPoolBalanceUSDBSC();

		console.log("BSC: Amount of tokens blxm: " + balanceWeiBlXM);
		console.log("BSC: Amount of tokens usd: " + balanceWeiUSD);

		return balanceWeiUSD / balanceWeiBlXM;
	}

	async getPoolPriceETH() {
		let balanceWeiBlXM = await this.getPoolBalanceBlxmETH();
		let balanceWeiUSD = await this.getPoolBalanceUSDETH();

		console.log("ETH: Amount of tokens blxm: " + balanceWeiBlXM);
		console.log("ETH: Amount of tokens usd: " + balanceWeiUSD);

		return balanceWeiUSD / balanceWeiBlXM;
	}
}


module.exports = ArbitrageService;
