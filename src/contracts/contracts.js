const constants = require("../constants");
const { ethers } = require("ethers");

const TokenContract = require("./TokenContract");
const ArbitrageContract = require("./ArbitrageContract");

class Contracts  {
	constructor(network) {
		this._network = network;

		switch(network) {
			case "BSC":
				if (process.env.NODE_ENV === "production") { 
					this.provider = new ethers.providers.JsonRpcProvider(constants.PROVIDER_BSC);
				}
				else {
					this.provider = new ethers.providers.JsonRpcProvider(constants.PROVIDER_BSC_TEST);
				}

				this.arbitrageWallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
				
				this.blxmTokenContract = new TokenContract(constants.BLXM_TOKEN_ADDRESS_BSC,  this.arbitrageWallet);
				this.usdTokenContract = new TokenContract(constants.USD_TOKEN_ADRESS_BSC, this.arbitrageWallet);
				this.arbitrageContract = new ArbitrageContract(constants.ARBITRAGE_CONTRACT_ADDRESS_BSC, this.arbitrageWallet);
				break;
			case "ETH":
				if (process.env.NODE_ENV === "production") { 
					this.provider = new ethers.providers.JsonRpcProvider(constants.PROVIDER_ETH);
				}
				else {
					this.provider = new ethers.providers.JsonRpcProvider(constants.PROVIDER_ETH_TEST);
				}
				this.arbitrageWallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);

				this.blxmTokenContract = new TokenContract(constants.BLXM_TOKEN_ADDRESS_ETH,  this.arbitrageWallet);
				this.usdTokenContract = new TokenContract(constants.USD_TOKEN_ADRESS_ETH, this.arbitrageWallet);
				this.arbitrageContract = new ArbitrageContract(constants.ARBITRAGE_CONTRACT_ADDRESS_ETH, this.arbitrageWallet);
				break;
		}
	}
}

module.exports = Contracts;
