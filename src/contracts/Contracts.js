const constants = require("../constants");
require("dotenv").config();

const TokenContract = require("./TokenContract");
const ArbitrageContract = require("./ArbitrageContract");

class Contracts  {
	constructor(network, signer) {
		this._network = network;

		if(this._network === "BSC") {
			this.blxmTokenContract = new TokenContract(constants.BLXM_TOKEN_ADDRESS_BSC,  signer);
			this.usdTokenContract = new TokenContract(constants.USD_TOKEN_ADRESS_BSC, signer);
			this.arbitrageContract = new ArbitrageContract(constants.ARBITRAGE_CONTRACT_ADDRESS_BSC);
		}

		else {
			this.blxmTokenContract = new TokenContract(constants.BLXM_TOKEN_ADDRESS_ETH,  signer);
			this.usdTokenContract = new TokenContract(constants.USD_TOKEN_ADRESS_ETH, signer);
			this.arbitrageContract = new ArbitrageContract(constants.ARBITRAGE_CONTRACT_ADDRESS_ETH);
		}
	}
}

module.exports = Contracts;
