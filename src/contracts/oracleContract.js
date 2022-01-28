const routerAbi = require("../abi/router_abi.json");
const liquidityPoolAbi = require("../abi/liquidityPool_abi.json");
const factoryAbi = require("../abi/factory_abi.json");
const constants = require("../constants");
const { ethers } = require("ethers");
const BigNumber = require("bignumber.js");
const logger = require("../logger/logger");
const TokenContract = require("./TokenContract");


class OracleContract {
	constructor(network, arbitrageContract, signer) {
		this.signer = signer;
		this.arbitrageContract = arbitrageContract;

		if (process.env.NODE_ENV === "production") {
			this.router = new ethers.Contract(constants["ROUTER_" + network], routerAbi, this.signer);
		}
		else {
			this.router = new ethers.Contract(constants["ROUTER_" + network + "_TESTNET"], routerAbi, this.signer);
		}

		this.basicTokenAddress = null;
		this.stableTokenAddress = null;
		this.factory = null;
		this.liquidityPool = null;

		this.basicTokenContract = null;
		this.stableTokenContract = null;
	}

	async init() {
		this.basicTokenAddress = await this.arbitrageContract.getBasicAddress();
		this.stableTokenAddress = await this.arbitrageContract.geStableAddress();

		let factoryAddress = await this.router.factory();
		this.factory = new ethers.Contract(factoryAddress, factoryAbi, this.signer);
		let liquidityPoolAddress = await this.factory.getPair(this.basicTokenAddress, this.stableTokenAddress);
		this.liquidityPool = new ethers.Contract(liquidityPoolAddress, liquidityPoolAbi, this.signer);

		this.basicTokenContract = new TokenContract(this.basicTokenAddress,  this.arbitrageWallet);
		this.stableTokenContract = new TokenContract(this.stableTokenAddress, this.arbitrageWallet);
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
		let blxmToken = poolReserves[1];
		return stableToken.div(blxmToken);
	}

	async getReserves() {
		if (this.liquidityPool === null && this.factory === null && this.basicTokenContract === null && this.stableTokenContract === null) {
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
}

module.exports = OracleContract;