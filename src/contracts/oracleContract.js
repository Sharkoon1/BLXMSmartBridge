const routerAbi = require("../abi/router_abi.json");
const liquidityPoolAbi = require("../abi/liquidityPool_abi.json");
const factoryAbi = require("../abi/factory_abi.json");
const constants = require("../constants");
const TokenContract = require("./TokenContract");
const { ethers } = require("ethers");
const BigNumber = require("bignumber.js");


class OracleContract {
	constructor(network, BLXMAddress, stableTokenAddress) {
		switch (network) {
			case "BSC":
				if (process.env.NODE_ENV === "production") {
					this.provider = new ethers.providers.JsonRpcProvider(constants.PROVIDER_BSC);
					this.arbitrageWallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
					this.router = new ethers.Contract(constants.ROUTER_BSC, routerAbi, this.arbitrageWallet);
				}
				else {
					this.provider = new ethers.providers.JsonRpcProvider(constants.PROVIDER_BSC_TEST);
					this.arbitrageWallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
					this.router = new ethers.Contract(constants.ROUTER_BSC_TESTNET, routerAbi, this.arbitrageWallet);
				}
				break;
			case "ETH":
				if (process.env.NODE_ENV === "production") {
					this.provider = new ethers.providers.JsonRpcProvider(constants.PROVIDER_ETH);
					this.arbitrageWallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
					this.router = new ethers.Contract(constants.ROUTER_ETH, routerAbi, this.arbitrageWallet);
				}
				else {
					this.provider = new ethers.providers.JsonRpcProvider(constants.PROVIDER_ETH_TEST);
					this.arbitrageWallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
					this.router = new ethers.Contract(constants.ROUTER_ETH_TESTNET, routerAbi, this.arbitrageWallet);
				}
		}
		this.blxmTokenContract = new TokenContract(BLXMAddress, this.arbitrageWallet);
		this.stableTokenContract = new TokenContract(stableTokenAddress, this.arbitrageWallet);
		this.BLXMTokenAddress = BLXMAddress;
		this.stableTokenAddress = stableTokenAddress;
		this.factory = null;
		this.liquidityPool = null;
	}

	async init_liquidityPool() {
		let factoryAddress = await this.router.factory();
		this.factory = new ethers.Contract(factoryAddress, factoryAbi, this.arbitrageWallet);
		let liquidityPoolAddress = await this.factory.getPair(this.BLXMTokenAddress, this.stableTokenAddress);
		this.liquidityPool = new ethers.Contract(liquidityPoolAddress, liquidityPoolAbi, this.arbitrageWallet);
	}

	async getPrice() {
		let poolReserves;
		try {
			poolReserves = await this.getReserves();
		} catch (error) {
			console.log("An error occured");
			console.log(error);
		}
		let stableToken = poolReserves[0];
		let blxmToken = poolReserves[1];
		return stableToken.div(blxmToken);
	}

	async getReserves() {
		if (this.liquidityPool === null && this.factory === null) {
			await this.init_liquidityPool();
		}
		try {
			let reserves = await this.liquidityPool.getReserves();
			let reservesStable = new BigNumber(ethers.utils.formatEther(reserves[0]));
			let reservesBasic = new BigNumber(ethers.utils.formatEther(reserves[1]));
			return [reservesStable, reservesBasic];
		} catch (error) {
			console.log("An error occured");
			console.log(error);
		}
	}
}

module.exports = OracleContract;