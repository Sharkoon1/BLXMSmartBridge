const BaseContract = require("./BaseContract");
const __path = require("path");

class ArbitrageContract extends BaseContract {
	constructor(contractAddress, signer) {
		const abi = require(__path.join(__dirname, "../abi/arbitrage_abi.json"));

		super(contractAddress, abi, signer);
	}

	async swapBasicToStable(amount) {
		return await this._contract.swapBasicToStable(this.DecimalToWei(amount));
	}

	async swapStableToBasic(amount) {
		return await this._contract.swapStableToBasic(this.DecimalToWei(amount));

	}

}

module.exports = ArbitrageContract;