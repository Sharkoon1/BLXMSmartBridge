const { ethers } = require("ethers");
const __path = require("path");
const constants = require("../constants");
const AdjustmentValueService = require("./AdjustmentValueService");
const Utility = require("../helpers/utility");

class ArbitrageService {

	constructor(bridgeService) {
		this.swapTransferFunctionName = "Transfer";
		this.BridgeService = bridgeService;

		this.init();
	}

	init() {
		const pool_bsc_abi = require(__path.join(__dirname, "../abi/pool_bsc_abi.json"));
		const pool_eth_abi = require(__path.join(__dirname, "../abi/pool_eth_abi.json"));
		const erc20_abi = require(__path.join(__dirname, "../abi/erc20_abi.json"));

		this.provider_eth = new ethers.providers.JsonRpcProvider(constants.PROVIDER_ETH);
		this.provider_bsc = new ethers.providers.JsonRpcProvider(constants.PROVIDER_BSC);

		this.wallet_BSC = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider_bsc);
		this.wallet_ETH = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider_eth);

		this.contract_pool_bsc = new ethers.Contract(constants.POOL_ADDRESS_BSC, pool_bsc_abi, this.wallet_BSC);
		this.contract_pool_eth = new ethers.Contract(constants.POOL_ADDRESS_ETH, pool_eth_abi, this.wallet_ETH);


		if (!this.contract_pool_bsc.deployed) {
			throw ("Contract pool in bsc has not been deployed or does not exist!");
		}

		if (!this.contract_pool_eth.deployed) {
			throw ("Contract pool in eth has not been deployed or does not exist!");
		}

		this.contract_blxm_token_bsc = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_BSC, erc20_abi, this.wallet_BSC);
		this.contract_usd_token_bsc = new ethers.Contract(constants.USD_TOKEN_ADRESS_BSC, erc20_abi, this.wallet_BSC);

		this.contract_blxm_token_eth = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_ETH, erc20_abi, this.wallet_ETH);
		this.contract_usd_token_eth = new ethers.Contract(constants.USD_TOKEN_ADRESS_ETH, erc20_abi, this.wallet_ETH);
		
	}

	_registerSwapEvents() {
		this.contract_pool_bsc.on(this.swapTransferFunctionName, (from, to, amount) => {
			this._startArbitrageCycleBSC();
		});

		this.contract_pool_eth.on(this.swapTransferFunctionName, (from, to, amount) => {
			this._startArbitrageCycleETH();
		});
	}

	async _startArbitrageCycleBSC() {
		let pool_price_bsc = await this.getPoolPriceBSC();
		let pool_price_eth = await this.getPoolPriceETH();

		console.log('ETH network price: ' + pool_price_bsc);
		console.log('BSC network price: '+ pool_price_eth);

		if (pool_price_bsc > pool_price_eth) {
			let arbitrage_balance_blxm_eth = await this.getArbitrageBalanceBlxmETH();

			let balanceBlxmBSC = await this.getPoolBalanceBlxmBSC();
			let balanceUsdcBSC = await this.getPoolBalanceUSDBSC();
			let balanceBlxmETH = await this.getPoolBalanceBlxmETH();
			let balanceUsdcETH = await this.getPoolBalanceUSDETH();

			let adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmETH, balanceUsdcETH, balanceBlxmBSC, balanceUsdcBSC);

			console.log('Adjustment value: '+ adjustmentValue);

			// is liqudity available ? 
			if (arbitrage_balance_blxm_eth > 0) {

				console.log('liquidity available, starting to bridge and swap.');

				 await this._bridgeAndSwapBSC(adjustmentValue, arbitrage_balance_blxm_eth);

				 if (this.isBscMoreExpensive()) { 
					this._startArbitrageCycleBSC();
				}

				else {
					return true;
				}
			}

			// provide liqudity in bsc
			// swap and bridge usd
			else {
				console.log('liquidity available, starting to bridge and swap.');

				let arbitrage_balance_usd_bsc = await this.getArbitrageBalanceUSDBSC();
				let arbitrage_balance_usd_eth = await this.getArbitrageBalanceUSDETH();

				// provide liquidity from cheap network via usd
				if (arbitrage_balance_usd_eth > 0) {
					// cheap network    
					let usd_amount = pool_price_eth * adjustmentValue;

					// swap exact amount or leftover usd in liquidity pool
					let usdSwapAmount = Math.min(usd_amount, balanceUsdcETH);

					// swap from bsc usd to bsc blxm
					await this._swapStablesToToken_BSC(usdSwapAmount);
				}

				// provide liquidity from expensive network via usd
				else if (arbitrage_balance_usd_bsc > 0) {
					// expensive network     
					let usd_amount = pool_price_bsc * adjustmentValue;
					let usdSwapAmount = Math.min(usd_amount, balanceUsdcETH);

					// bridge usdc from bsc to eth
					await this.BridgeService.swapUSDTokenBSC(usdSwapAmount);

					// swap from eth usd to eth blxm
					await this._swapStablesToToken_ETH(usdSwapAmount);
				}

				arbitrage_balance_blxm_eth = this.getArbitrageBalanceBlxmBSC();

				await this._bridgeAndSwapBSC(adjustmentValue, arbitrage_balance_blxm_eth);

				if (this.isBscMoreExpensive()) { 
					this._startArbitrageCycleBSC();
				}

				else {
					return true;
				}
			}
		}
	}

	async isBscMoreExpensive() {
		let newPoolPriceBsc = await this.getPoolPriceBSC();
		let newPoolPriceEth = await this.getPoolPriceETH();

		console.log('Price after cycle in eth: ' + newPoolPriceEth);
		console.log('Price after cycle in bsc: ' + newPoolPriceBsc);

		return newPoolPriceBsc > newPoolPriceEth;
	}

	async isEthMoreExpensive() {
		let newPoolPriceBsc = await this.getPoolPriceBSC();
		let newPoolPriceEth = await this.getPoolPriceETH();

		console.log('Price after cycle in eth: ' + newPoolPriceEth);
		console.log('Price after cycle in bsc: ' + newPoolPriceBsc);

		return newPoolPriceBsc < newPoolPriceEth;
	}

	async _startArbitrageCycleETH() {
		let pool_price_bsc = await this.getPoolPriceBSC();
		let pool_price_eth = await this.getPoolPriceETH();

		console.log('ETH network price: ' + pool_price_eth);
		console.log('BSC network price: '+ pool_price_eth);

		if (pool_price_bsc < pool_price_eth) {
			let arbitrage_balance_blxm_bsc = await this.getArbitrageBalanceBlxmBSC();

			let balanceBlxmBSC = await this.getPoolBalanceBlxmBSC();
			let balanceUsdcBSC = await this.getPoolBalanceUSDBSC();
			let balanceBlxmETH = await this.getPoolBalanceBlxmETH();
			let balanceUsdcETH = await this.getPoolBalanceUSDETH();

			let adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmBSC, balanceUsdcBSC, balanceBlxmETH, balanceUsdcETH);

			console.log('Adjustment value: '+ adjustmentValue);

			// is liqudity avaible ? 
			if (arbitrage_balance_blxm_bsc > 0) {
				console.log('liquidity available, starting to bridge and swap.');

				await this._bridgeAndSwapETH(adjustmentValue, arbitrage_balance_blxm_bsc);

				if (this.isEthMoreExpensive()) { 
					this._startArbitrageCycleETH();
				}

				else {
					return true;
				}
			}

			// provide liqudity in bsc
			// swap and bridge usd
			else {
				console.log('liquidity available, starting to bridge and swap.');

				let arbitrage_balance_usd_bsc = await this.getArbitrageBalanceUSDBSC();
				let arbitrage_balance_usd_eth = await this.getArbitrageBalanceUSDETH();

				// provide liquidity from cheap network via usd
				if (arbitrage_balance_usd_bsc > 0) {
					// cheap network    
					let usd_amount = pool_price_bsc * adjustmentValue;
					let usdSwapAmount = Math.min(usd_amount, balanceUsdcBSC);

					// swap in bsc usd to blxm
					await this._swapStablesToToken_BSC(usdSwapAmount);
				}

				// provide liquidity from expensive network via usd
				else if (arbitrage_balance_usd_eth > 0) {
					// expensive network                         
					let usd_amount = pool_price_eth * adjustmentValue;
					let usdSwapAmount = Math.min(usd_amount, balanceUsdcETH);

					// bridge usdc from eth to bsc
					await this.BridgeService.swapUSDTokenETH(usdSwapAmount);

					// swap usd from bsc to blxm
					await this._swapStablesToToken_ETH(usdSwapAmount);
				}

				arbitrage_balance_blxm_bsc = await this.getArbitrageBalanceBlxmBSC();

				await this._bridgeAndSwapETH(adjustmentValue, arbitrage_balance_blxm_bsc);

				if (this.isEthMoreExpensive()) { 
					this._startArbitrageCycleETH();
				}

				else {
					return true;
				}
			}
		}
	}

	async _bridgeAndSwapETH(amount, abitrageBalance) {
		// bridge result
		let bridgeResult = await this.BridgeService.swapBLXMTokenBscToEth(amount);

		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Math.min(amount, abitrageBalance);

		console.log('Amount to swap on liquidity pool: ' + swapAmount);

		await this._swapTokenToStables_ETH(swapAmount);
	}

	async _bridgeAndSwapBSC(amount, abitrageBalance) {
		// bridge result
		let bridgeResult = await this.BridgeService.swapBLXMTokenEthToBsc(amount);

		// swap exact amount, if abitrage pool has enough tokens, swap minimal avaible otherwise
		let swapAmount = Math.min(amount, abitrageBalance);

		console.log('Amount to swap on liquidity pool: ' + swapAmount);

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

		console.log('BSC: Amount of tokens blxm: ' + balanceWeiBlXM);
		console.log('BSC: Amount of tokens usd: ' + balanceWeiUSD);

		return balanceWeiUSD / balanceWeiBlXM;
	}

	async getPoolPriceETH() {
		let balanceWeiBlXM = await this.getPoolBalanceBlxmETH();
		let balanceWeiUSD = await this.getPoolBalanceUSDETH();

		console.log('ETH: Amount of tokens blxm: ' + balanceWeiBlXM);
		console.log('ETH: Amount of tokens usd: ' + balanceWeiUSD);

		return balanceWeiUSD / balanceWeiBlXM;
	}
}


module.exports = ArbitrageService;
