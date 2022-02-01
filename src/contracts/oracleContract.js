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

			this._wrappedTokenAddress = constants["WRAPPED_TOKEN_ADDRESS_" + network];
			this._stableTokenAddress = constants["STABLE_TOKEN_ADDRESS_" + network];
		}
		else {
			this.provider = new ethers.providers.JsonRpcProvider(constants["PROVIDER_" + network + "_TEST"]);
			this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
			this.router = new ethers.Contract(constants["ROUTER_" + network + "_TESTNET"], routerAbi, this.signer);

			this._wrappedTokenAddress = constants["WRAPPED_TOKEN_ADDRESS_" + network + "_TESTNET"];
			this._stableTokenAddress = constants["STABLE_TOKEN_ADDRESS_" + network  + "_TESTNET"];
		}

		this.basicTokenAddress = basicTokenAddress;
		this.stableTokenAddress = stableTokenAddress;
		
		this.factory = null;
		this.liquidityPool = null;
		this.liquidityPoolWrapped = null;

		this.liquidityPoolAddress;
	}

	async initWrapped() {
		let factoryAddress = await this.router.factory();
		this.factory = new ethers.Contract(factoryAddress, factoryAbi, this.signer);
		let liquidityPoolWrapped = await this.factory.getPair(this._wrappedTokenAddress, this._stableTokenAddress);
		this.liquidityPoolWrapped = new ethers.Contract(liquidityPoolWrapped, liquidityPoolAbi, this.signer);
	}

	async init() {
		let factoryAddress = await this.router.factory();
		this.factory = new ethers.Contract(factoryAddress, factoryAbi, this.signer);
		this.liquidityPoolAddress = this.factory.getPair(this.basicTokenAddress, this.stableTokenAddress);
		this.liquidityPool = new ethers.Contract(this.liquidityPoolAddress, liquidityPoolAbi, this.signer);
	}

	async getWrappedPrice() {
		let poolReserves;
		try {
			poolReserves = await this.getReserves();
		} catch (error) {
			logger.error("An error occured retrieving the network prices.");
			logger.error("Error: " + error);
		}
		let stableToken = poolReserves[0];
		let wrappedToken = poolReserves[1];
		return stableToken.div(wrappedToken);
	}

	async getWrappedReserves() {
		if (this.liquidityPoolWrapped === null) {
			await this.initWrapped();
		}
		try {
			let reserves = await this.liquidityPool.getReserves();
			let reservesStable = new BigNumber(ethers.utils.formatEther(reserves[0]));
			let reservesWrapped = new BigNumber(ethers.utils.formatEther(reserves[1]));
			return [reservesStable, reservesWrapped];
		} catch (error) {
			logger.error("An error occured retrieving pool reserves.");
			logger.error("Error: " + error);
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