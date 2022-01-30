const BaseContract = require("./BaseContract");
const __path = require("path");

class TokenContract extends BaseContract {
	constructor(contractAddress, signer) {
		const erc20_abi = require(__path.join(__dirname, "../abi/erc20_abi.json"));

		super(contractAddress, erc20_abi, signer);

	}

	async getTokenBalance(address) {
		return await this._contract.callStatic.balanceOf(address);
	}

	async transferTokens(address, amount) {
		let tx = await this._contract.transfer(address, amount);
		await tx.wait();
		
		return tx; 
	}

	async getName(){
		return await this._contract.symbol();
	}
}

module.exports = TokenContract;