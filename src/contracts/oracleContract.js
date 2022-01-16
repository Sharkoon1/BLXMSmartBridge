const routerAbi = require("../abi/router_abi.json");
const liquidityPoolAbi = require("../abi/liquidityPool_abi.json");
const factoryAbi = require("../abi/factory_abi.json");
const constants = require("../constants");
const TokenContract = require("./TokenContract");
const { ethers } = require("ethers");

class OracleContract{
	constructor(network, BLXMAddress, stableTokenAddress){
		switch(network) {
			case "BSC":
				this.provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_BSC);
				this.arbitrageWallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
				this.router = new ethers.Contract(constants.ROUTER_BSC, routerAbi, this.arbitrageWallet);
				break;
			case "ETH":
				this.provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_ETH);
				this.arbitrageWallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
				this.router = new ethers.Contract(constants.ROUTER_ETH, routerAbi, this.arbitrageWallet);
		}
		this.blxmTokenContract = new TokenContract(BLXMAddress,  this.arbitrageWallet);
		this.stableTokenContract = new TokenContract(stableTokenAddress, this.arbitrageWallet);
		this.BLXMTokenAddress = BLXMAddress;
		this.stableTokenAddress = stableTokenAddress;
		this.factoryAddress;		
		this.liquidityPoolAddress;
		this.factory;
		this.liquidityPool;
	}

	async getPrice() {
		let tokensToSell = this.blxmTokenContract.DecimalToWei(1);
		let tokenInStable;
		try {
			tokenInStable = await this.router.callStatic.getAmountsOut(tokensToSell, [this.BLXMTokenAddress, this.stableTokenAddress]);
		} catch (error) {
			console.log("An error occured");
			console.log(error);
		}
		return ethers.utils.formatEther(tokenInStable[1]);
	}

	async getReserves() {
		try {
			let factoryAddress = await this.router.factory();
			this.factory = new ethers.Contract(factoryAddress, factoryAbi, this.arbitrageWallet);
			let liquidityPoolAddress = await this.factory.getPair(this.BLXMTokenAddress, this.stableTokenAddress);
			this.liquidityPool = new ethers.Contract(liquidityPoolAddress, liquidityPoolAbi, this.arbitrageWallet);
			let reserves = await this.liquidityPool.getReserves();
			return [ethers.utils.formatEther(reserves[0]), ethers.utils.formatEther(reserves[1])];
		} catch (error) {
			console.log("An error occured");
			console.log(error);
		}
	}

}

module.exports = OracleContract;