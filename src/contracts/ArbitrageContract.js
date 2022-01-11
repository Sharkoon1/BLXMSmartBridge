const BaseContract = require("./BaseContract");
const __path = require("path");

class ArbitrageContract extends BaseContract {
	constructor(contractAddress, signer) {
		const abi = require(__path.join(__dirname, "../abi/arbitrage_abi.json"));

		super(contractAddress, abi, signer);
	}

	async swapBasicToStable(amount) {
		return await this._contract.swapBasicToStable(amount);
	}

	async swapStableToBasic(amount) {
		return await this._contract.swapStableToBasic(amount);

    }

	async changeBasic(address) {
		return await this._contract.changeBasic(address);
	}

	async changeStable(address) {
		return await this._contract.changeStable(address);
	}

}

module.exports = PoolContract;