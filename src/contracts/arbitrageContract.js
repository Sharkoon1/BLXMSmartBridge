const BaseContract = require("./BaseContract");
const TokenContract = require("./TokenContract");
const __path = require("path");
const { ethers } = require("ethers");
const constants = require("../constants");
const BigNumber = require("bignumber.js");

class ArbitrageContract extends BaseContract {
	constructor(network) {
		const abi = require(__path.join(__dirname, "../abi/arbitrage_abi.json"));		
		let provider;
		let signer;
		

		if (process.env.NODE_ENV === "production") {  
			provider = new ethers.providers.JsonRpcProvider(constants["PROVIDER_" + network]);
			signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

			super(constants["ARBITRAGE_CONTRACT_ADDRESS_" + network], abi, signer);
		}
		else {
			provider = new ethers.providers.JsonRpcProvider(constants["PROVIDER_" + network + "_TEST"]);
			signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

			super(constants["ARBITRAGE_CONTRACT_ADDRESS_" + network + "_TESTNET"], abi, signer);
		}
		this.signer = signer;
		this.provider = provider;
	}

	async getStableBalance() {
		let stableAddress = await this.getStableAddress();
		let stableContract = new TokenContract(stableAddress, this._signer);	

		let balance = await stableContract.getTokenBalance(this._contractAddress); 

		return new BigNumber(ethers.utils.formatEther(balance));
	}

	async getBasicBalance() {
		let basicAddress = await this.getBasicAddress();
		let basicContract = new TokenContract(basicAddress, this._signer);
		
		let balance =  await basicContract.getTokenBalance(this._contractAddress); 

		return new BigNumber(ethers.utils.formatEther(balance));
	}

	async getBasicName(){
		let basicAddress = await this.getBasicAddress();

		let basicContract = new TokenContract(basicAddress, this._signer);

		return await basicContract.getName(); 
	}

	async getStableName() {
		let stableAddress = await this.getStableAddress();

		let stableContract = new TokenContract(stableAddress, this._signer);

		return await stableContract.getName(); 
	}
	
	async getWalletBalance() {
		return await this._signer.getBalance();
	}

	async getBasicAddress() {
		return await this._contract.callStatic.basicAddress();
	}

	async getStableAddress() {
		return await this._contract.callStatic.stableAddress();
	}

	async swapBasicToStableGasLimit(amount, minAmountOut) {
		let gasLimit = await this._contract.estimateGas.swapBasicToStable(amount, minAmountOut);

		return gasLimit;
	}
	
	async swapStableToBasicGasLimit(amount, minAmountOut) {
		let gasLimit = await this._contract.estimateGas.swapStableToBasic(amount, minAmountOut);

		return gasLimit;
	}

	async swapBasicToStable(amount, minAmountOut) {
		return await this._contract.swapBasicToStable(amount, minAmountOut);
	}

	async swapStableToBasic(amount, minAmountOut) {
		return await this._contract.swapStableToBasic(amount, minAmountOut);
	}

}

module.exports = ArbitrageContract;