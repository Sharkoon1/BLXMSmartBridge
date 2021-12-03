const { ethers } = require("ethers");
const constants = require("../constants");
require("dotenv").config();

const TokenContract = require('./TokenContract');
const PoolContract = require('./PoolContract');

class Contracts  {
    constructor(network, signer) {
        this._network = network;

        if(this._network === "BSC") {
            this.blxmTokenContract = new TokenContract(constants.BLXM_TOKEN_ADDRESS_BSC,  signer);
            this.usdTokenContract = new TokenContract(constants.USD_TOKEN_ADRESS_BSC, signer);
            this.poolContract = new PoolContract(constants.POOL_ADDRESS_BSC, signer);
        }

        else {
            this.blxmTokenContract = new TokenContract(constants.BLXM_TOKEN_ADDRESS_BSC,  signer);
            this.usdTokenContract = new TokenContract(constants.USD_TOKEN_ADRESS_BSC, signer);
            this.poolContract = new PoolContract(constants.POOL_ADDRESS_BSC, signer);
        }
    }

    async getPoolPrice() {
        let numberOfBlxmToken = await this.blxmTokenContract.getTokenBalance(constants["POOL_ADDRESS_" + this._network]);
		let numberOfUsdToken = await this.usdTokenContract.getTokenBalance(constants["POOL_ADDRESS_" + this._network]);

		return numberOfUsdToken / numberOfBlxmToken;
    }
}

module.exports = Contracts;
