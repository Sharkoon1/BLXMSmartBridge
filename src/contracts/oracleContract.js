const routerAbi = require("../abi/router_abi.json");
const liquidityPoolAbi = require("../abi/liquidityPool_abi.json");
const factoryAbi = require("../abi/factory_abi.json");
const constants = require("../constants");
const { ethers } = require("ethers");
const BigNumber = require("bignumber.js");
const logger = require("../logger/logger");

class OracleContract {
	constructor(network, basicTokenAddress, stableTokenAddress) {
		if (process.env.NODE_ENV === "production") {
			this.provider = new ethers.providers.JsonRpcProvider(constants["PROVIDER_" + network]);
			this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
			this.router = new ethers.Contract(constants["ROUTER_" + network], routerAbi, this.signer);
		}
		else {
			this.provider = new ethers.providers.JsonRpcProvider(constants["PROVIDER_" + network + "_TEST"]);
			this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
			this.router = new ethers.Contract(constants["ROUTER_" + network + "_TESTNET"], routerAbi, this.signer);
		}
		
		this._wrappedTokenAddress = constants["WRAPPED_TOKEN_ADDRESS_" + network];
		this._stableTokenAddress = constants["STABLE_TOKEN_ADDRESS_" + network];

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
		this.liquidityPoolAddress = this.factory.getPair(this.basicTokenAddress, this.stableTokenAddress);
		if(this.liquidityPoolAddress === ethers.constants.AddressZero) {
			logger.error(this.network +  ": liquidity pool does not exist. For basic token address:" + this.basicTokenAddress 
									   + "and stable token address: " +  this.stableTokenAddress);
		}
		this.liquidityPool = new ethers.Contract(this.liquidityPoolAddress, liquidityPoolAbi, this.signer);
	}

	async getWrappedPrice() {
		let price;
		try {
			// Workaround since wrapped bnb pools in testnet are not dynamic and prices are not accurate.
			// So we also have to use production pools to get the price in the testnet
			if (process.env.NODE_ENV !== "production") { 	
				let provider = new ethers.providers.JsonRpcProvider(constants["PROVIDER_" + this.network]);
				let signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
				let router = new ethers.Contract(constants["ROUTER_" + this.network], routerAbi, signer);

				price = await router.getAmountsOut(ethers.utils.parseEther("1"), [this._wrappedTokenAddress, this._stableTokenAddress]);
			}
			else {
				price = await this.router.getAmountsOut(ethers.utils.parseEther("1"), [this._wrappedTokenAddress, this._stableTokenAddress]);
			}
		} catch (error) {
			logger.error("An error occured retrieving the network prices.");
			logger.error("Error: " + error);
		}

		if(this.network === "BSC") {
			return new BigNumber(ethers.utils.formatEther(price[1]));
		}
		else {
			return new BigNumber(price[1].toString()).dividedBy(10**6);
		}
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
		return stableToken.div(basicToken);
	}

	async getReserves() {
		if (this.liquidityPool === null) {
			await this.init();
		}
		try {
			let reserves = await this.liquidityPool.getReserves();
			let reservesStable = new BigNumber(ethers.utils.formatEther(reserves[0]));
			let reservesBasic = new BigNumber(ethers.utils.formatEther(reserves[1]));
			return [reservesStable, reservesBasic];
		} catch (error) {
			logger.error("An error occured retrieving pool reserves.");
			logger.error("Error: " + error);
		}
	}

	async getPoolAddress(){
		if (this.liquidityPool === null) {
			await this.init();
		}
		return this.liquidityPoolAddress;
	}
}

module.exports = OracleContract;