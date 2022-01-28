const constants = require("../constants");
const { ethers } = require("ethers");

const ArbitrageContract = require("./ArbitrageContract");
const OracleContract = require("./oracleContract");

class Contracts  {
	constructor(network) {
		this._network = network;
		this.provider;
		this.arbitrageWallet;
		this.arbitrageContract;
		this.oracleContract;

		if (process.env.NODE_ENV === "production") {  
			this.provider = new ethers.providers.JsonRpcProvider(constants["PROVIDER_" + this._network]);
			this.arbitrageWallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
			this.arbitrageContract = new ArbitrageContract(constants["ARBITRAGE_CONTRACT_ADDRESS_" + this._network], this.arbitrageWallet);
		}
		else {
			this.provider = new ethers.providers.JsonRpcProvider(constants["PROVIDER_" + this._network + "_TEST"]);
			this.arbitrageWallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
			this.arbitrageContract = new ArbitrageContract(constants["ARBITRAGE_CONTRACT_ADDRESS_" + this._network + "_TESTNET"], this.arbitrageWallet);		
		}

		this.oracleContract = new OracleContract(this._network, this.arbitrageContract, this.arbitrageWallet);						
	}
}

module.exports = Contracts;
