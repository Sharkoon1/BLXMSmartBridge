const routerAbi = require("../abi/router_abi.json");
const liquidityPoolAbi = require("../abi/liquidityPool_abi.json");
const factoryAbi = require("../abi/factory_abi.json");
const arbitrageAbi = require("../abi/arbitrage_abi.json");
const constants = require("../constants");
const { ethers } = require("ethers");
const BigNumber = require("bignumber.js");
const logger = require("../logger/logger");
const ArbitrageService = require("../service/arbitrageServiceV2");
const TokenContract = require("./tokenContract");

class OracleContract {
	constructor(network, basicTokenAddress, stableTokenAddress) {
		if (process.env.NODE_ENV === "production") {
			this.provider = new ethers.providers.StaticJsonRpcProvider(constants["PROVIDER_" + network]);
			this.signer = new ethers.Wallet(process.env["PRIVATE_KEY_" + network], this.provider);
			this.router = new ethers.Contract(constants["ROUTER_" + network], routerAbi, this.signer);
			this.arbitrageContract = new ethers.Contract(constants["ARBITRAGE_CONTRACT_ADDRESS_" + network], arbitrageAbi, this.signer);
		}
		else {
			this.provider = new ethers.providers.StaticJsonRpcProvider(constants["PROVIDER_" + network + "_TEST"]);
			this.signer = new ethers.Wallet(process.env["PRIVATE_KEY_" + network], this.provider);
			this.router = new ethers.Contract(constants["ROUTER_" + network + "_TESTNET"], routerAbi, this.signer);
			this.arbitrageContract = new ethers.Contract(constants["ARBITRAGE_CONTRACT_ADDRESS_" + network + "_TESTNET"], arbitrageAbi, this.signer);
		}

		this._wrappedTokenAddress = constants["WRAPPED_TOKEN_ADDRESS_" + network];
		this._usdTokenAddress = constants["USD_TOKEN_ADDRESS_" + network];
		this._usdTokenDecimals = 18;

		this.network = network;
		this.basicTokenAddress = basicTokenAddress;
		this.stableTokenAddress = stableTokenAddress;

		this.factory = null;
		this.liquidityPool = null;
		this.liquidityPoolWrapped = null;

		this.liquidityPoolAddress;
	}

	async init() {
		let factoryAddress = await this.router.factory();
		this.factory = new ethers.Contract(factoryAddress, factoryAbi, this.signer);
		this.liquidityPoolAddress = await this.factory.getPair(this.basicTokenAddress, this.stableTokenAddress);
		if(this.liquidityPoolAddress === ethers.constants.AddressZero) {
			logger.error(`${this.network}: liquidity pool does not exist. For basic token address:${this.basicTokenAddress}and stable token address: ${this.stableTokenAddress}`);
		}
		this.liquidityPool = new ethers.Contract(this.liquidityPoolAddress, liquidityPoolAbi, this.signer);

		// get usd token decimals
		let usdTokenContract = new TokenContract(this._usdTokenAddress,  this.getSigner());
		this._usdTokenDecimals = await usdTokenContract.getDecimals();

		this.arbitrageContract.on("changedBasic", (newBasicAddress) => {
			this.factory.getPair(newBasicAddress, this.stableTokenAddress).then((poolAddress) => {
				this.liquidityPoolAddress = poolAddress;
				if(this.liquidityPoolAddress === ethers.constants.AddressZero) {
					logger.error(`${this.network}: liquidity pool does not exist. For basic token address:${newBasicAddress}and stable token address: ${this.stableTokenAddress}`);
				}
				this.liquidityPool = new ethers.Contract(this.liquidityPoolAddress, liquidityPoolAbi, this.signer);

				ArbitrageService.stopCycle = true;

				logger.info("Stopping arbitrage cycle, because basic address has been changed");
			});
		});

		this.arbitrageContract.on("changedStable", (newStableAddress) => {
			this.factory.getPair(this.basicTokenAddress, newStableAddress).then((poolAddress) => {
				this.liquidityPoolAddress = poolAddress;
				if(this.liquidityPoolAddress === ethers.constants.AddressZero) {
					logger.error(`${this.network}: liquidity pool does not exist. For basic token address:${this.basicTokenAddress}and stable token address: ${newStableAddress}`);
				}
				this.liquidityPool = new ethers.Contract(this.liquidityPoolAddress, liquidityPoolAbi, this.signer);

				ArbitrageService.stopCycle = true;

				logger.info("Stopping arbitrage cycle, because stable address has been changed");
			});
		});
	}

	async getStableUsdPrice() {
		let price;
		try {
			// Workaround since wrapped bnb pools in testnet are not dynamic and prices are not accurate.
			// So we also have to use production pools to get the price in the testnet
			if (process.env.NODE_ENV !== "production") {
				let signer = this.getSigner();

				let router = new ethers.Contract(constants["ROUTER_" + this.network], routerAbi, signer);

				price = await router.getAmountsOut(ethers.utils.parseEther("1"), [this._wrappedTokenAddress, this._usdTokenAddress]);
			}
			else {
				price = await this.router.getAmountsOut(ethers.utils.parseEther("1"), [this.stableTokenAddress, this._usdTokenAddress]);
			}
		} catch (error) {
			logger.error("An error occured retrieving the network prices.");
			logger.error("Error: " + error);
		}

		return new BigNumber(price[1].toString()).dividedBy(10**this._usdTokenDecimals);
	}

	async getWrappedPrice() {
		let price;
		try {
			// Workaround since wrapped bnb pools in testnet are not dynamic and prices are not accurate.
			// So we also have to use production pools to get the price in the testnet
			if (process.env.NODE_ENV !== "production") {
				let signer = this.getSigner();
				let router = new ethers.Contract(constants["ROUTER_" + this.network], routerAbi, signer);

				price = await router.getAmountsOut(ethers.utils.parseEther("1"), [this._wrappedTokenAddress, this._usdTokenAddress]);
			}
			else {
				price = await this.router.getAmountsOut(ethers.utils.parseEther("1"), [this._wrappedTokenAddress, this._usdTokenAddress]);
			}
		} catch (error) {
			logger.error("An error occured retrieving the network prices.");
			logger.error("Error: " + error);
		}

		return new BigNumber(price[1].toString()).dividedBy(10**this._usdTokenDecimals);
	}

	async getPrice() {
		let poolReserves;
		try {
			poolReserves = await this.getReserves();
		} catch (error) {
			logger.error("An error occured retrieving the network prices.");
			logger.error("Error: " + error);
		}

		let stableToken = poolReserves[0];
		let basicToken = poolReserves[1];

		if(this.stableTokenAddress.toLowerCase() !== constants["HUSD_" + this.network + "_TESTNET"].toLowerCase()
		&& this.stableTokenAddress.toLowerCase() !== constants["USD_TOKEN_ADDRESS_" + this.network].toLowerCase()) {
			let stableUsdPrice = await this.getStableUsdPrice();

			stableToken = stableToken.multipliedBy(stableUsdPrice);
		}

		return stableToken.dividedBy(basicToken);
	}

	async getReserves() {
		if (this.liquidityPool === null) {
			await this.init();
		}
		try {
			let reserves = await this.liquidityPool.getReserves();
			let token0 = await this.liquidityPool.token0();
			let token1 = await this.liquidityPool.token1();
			let index0 = token0 === this.stableTokenAddress ? 0 : 1;
			let index1 = token1 === this.basicTokenAddress ? 1 : 0;
			let reservesStable = new BigNumber(ethers.utils.formatEther(reserves[index0]));
			let reservesBasic = new BigNumber(ethers.utils.formatEther(reserves[index1]));
			return [reservesStable, reservesBasic];
		} catch (error) {
			logger.error("An error occured retrieving pool reserves.");
			logger.error("Error: " + error);
		}
	}

	async getsAmountOutStable(amountIn) {
		let amountOut = await this.router.getAmountsOut(amountIn, [this.basicTokenAddress, this.stableTokenAddress]);

		return amountOut[1];
	}

	async getsAmountOutBasic(amountIn) {
		let amountOut = await this.router.getAmountsOut(amountIn, [this.stableTokenAddress, this.basicTokenAddress]);

		return amountOut[1];
	}

	async getPoolAddress(){
		if (this.liquidityPool === null) {
			await this.init();
		}
		return this.liquidityPoolAddress;
	}

	getSigner() {
		if (process.env.NODE_ENV !== "production") {
			let provider = new ethers.providers.StaticJsonRpcProvider(constants["PROVIDER_" + this.network]);
			let signer = new ethers.Wallet(process.env["PRIVATE_KEY_" + this.network], provider);

			return signer;
		}
		else {
			return this.signer;
		}
	}
}

module.exports = OracleContract;
