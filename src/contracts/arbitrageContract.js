const BaseContract = require("./baseContract");
const TokenContract = require("./tokenContract");
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
			provider = new ethers.providers.StaticJsonRpcProvider(constants["PROVIDER_" + network]);
			signer = new ethers.Wallet(process.env["PRIVATE_KEY_" + network], provider);

			super(constants["ARBITRAGE_CONTRACT_ADDRESS_" + network], abi, signer);
		}
		else {
			provider = new ethers.providers.StaticJsonRpcProvider(constants["PROVIDER_" + network + "_TEST"]);
			signer = new ethers.Wallet(process.env["PRIVATE_KEY_" + network], provider);

			super(constants["ARBITRAGE_CONTRACT_ADDRESS_" + network + "_TESTNET"], abi, signer);
		}
		this.signer = signer;
		this.provider = provider;
	}

	async getSignerAddress() {
		return await this.signer.getAddress();
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
		return await this._contract.basicAddress();
	}

	async getStableAddress() {
		return await this._contract.stableAddress();
	}

	async swapBasicToStableGasLimit(amount, minAmountOut) {
		return await this._contract.estimateGas.swapBasicToStable(amount, minAmountOut);
	}

	async swapStableToBasicGasLimit(amount, minAmountOut) {
		return await this._contract.estimateGas.swapStableToBasic(amount, minAmountOut);
	}

	async swapBasicToStable(amount, minAmountOut, gasLimit, gasPrice) {
		return await this._contract.swapBasicToStable(amount, minAmountOut, {gasPrice: gasPrice, gasLimit: gasLimit});
	}

	async swapStableToBasic(amount, minAmountOut, gasLimit, gasPrice) {
		return await this._contract.swapStableToBasic(amount, minAmountOut, {gasPrice: gasPrice, gasLimit: gasLimit});
	}

}

module.exports = ArbitrageContract;
