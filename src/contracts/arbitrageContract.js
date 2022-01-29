const BaseContract = require("./BaseContract");
const TokenContract = require("./TokenContract");
const __path = require("path");

class ArbitrageContract extends BaseContract {
	constructor(contractAddress, signer) {
		const abi = require(__path.join(__dirname, "../abi/arbitrage_abi.json"));		
		super(contractAddress, abi, signer);
	}

	async getStableBalance() {
		let stableAddress = await this.geStableAddress();

		let stableContract = new TokenContract(stableAddress, this._signer);

		return await stableContract.getTokenBalance(this._contractAddress); 
	}

	async getBasicAddress() {
		return await this._contract.callStatic.basicAddress();
	}

	async geStableAddress() {
		return await this._contract.callStatic.stableAddress();
	}

	async swapBasicToStableGasLimit(amount) {
		let gasLimit = await this._contract.estimateGas.swapBasicToStable(amount);

		return gasLimit;
	}
	
	async swapStableToBasicGasLimit(amount) {
		let gasLimit = await this._contract.estimateGas.swapStableToBasic(amount);

		return gasLimit;
	}

	async swapBasicToStable(amount) {
		return await this._contract.swapBasicToStable(amount);
	}

	async swapStableToBasic(amount) {
		return await this._contract.swapStableToBasic(amount);
	}

}

module.exports = ArbitrageContract;