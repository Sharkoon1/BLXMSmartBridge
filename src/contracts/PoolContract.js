const BaseContract = require("./BaseContract");
const __path = require("path");

class PoolContract extends BaseContract {
	constructor(contractAddress, signer) {
		const abi = require(__path.join(__dirname, "../abi/pool_abi.json"));

		super(contractAddress, abi, signer);
	}

	async swapTokenToStables(amount) {
		let tx = await this._contract.stablesToToken(amount);
		await tx.wait();

		return tx;
	}

	async swapStablesToToken(amount) {
		let tx = await this._contract.stablesToToken(amount);
		await tx.wait();

		return tx; 
	}
}

module.exports = PoolContract;