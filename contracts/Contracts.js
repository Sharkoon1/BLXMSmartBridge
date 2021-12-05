const constants = require("../constants");
const { ethers } = require("ethers");
require("dotenv").config();

const TokenContract = require("./TokenContract");
const PoolContract = require("./PoolContract");

class Contracts  {
	constructor(network, signer) {
		this._network = network;

		if(this._network === "BSC") {
			this.blxmTokenContract = new TokenContract(constants.BLXM_TOKEN_ADDRESS_BSC,  signer);
			this.usdTokenContract = new TokenContract(constants.USD_TOKEN_ADRESS_BSC, signer);
			this.poolContract = new PoolContract(constants.POOL_ADDRESS_BSC, signer);
		}

		else {
			this.blxmTokenContract = new TokenContract(constants.BLXM_TOKEN_ADDRESS_ETH,  signer);
			this.usdTokenContract = new TokenContract(constants.USD_TOKEN_ADRESS_ETH, signer);
			this.poolContract = new PoolContract(constants.POOL_ADDRESS_ETH, signer);
		}
	}

	async getPoolNumberOfBlxmToken(){
		return await this.blxmTokenContract.getTokenBalance(constants["POOL_ADDRESS_" + this._network]);
	}

	async getPoolNumberOfUsdToken(){
		return await this.usdTokenContract.getTokenBalance(constants["POOL_ADDRESS_" + this._network]);
	}

	async getPoolPrice() {
		let numberOfBlxmToken = await this.getPoolNumberOfBlxmToken();
		let numberOfUsdToken = await this.getPoolNumberOfUsdToken();

		numberOfUsdToken = ethers.utils.formatEther(numberOfUsdToken);
		numberOfBlxmToken = ethers.utils.formatEther(numberOfBlxmToken);

		return ethers.utils.parseEther(String(numberOfUsdToken / numberOfBlxmToken));
	}
}

module.exports = Contracts;
