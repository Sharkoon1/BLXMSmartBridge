const BaseContract = require("./BaseContract");
const __path = require("path");

class PoolContract extends BaseContract {
	constructor(contractAddress, signer) {
		const abi = require(__path.join(__dirname, "../abi/pool_abi.json"));

		super(contractAddress, abi, signer);
	}

	async swapTokenToStables(amount) {
		return await this._contract.tokenToStables(amount);
	}

	async swapStablesToToken(amount) {
		return await this._contract.stablesToToken(amount);
	}
}

module.exports = PoolContract;