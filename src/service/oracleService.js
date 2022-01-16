const OracleUniswap = require("../oracles/OracleUniswap");
const OraclePancakeswap = require("../oracles/OraclePancakeswap");

class OracleService {

	constructor(Uniswap = true) {
		this.oracle = Uniswap ? new OracleUniswap() : new OraclePancakeswap();
	}

	async getPrice() {
		return await this.oracle.getPrice();
	}

	async getReserveBLXM() {
		return await this.oracle.getReserveBLXM();
	}

	async getReserveStableToken() {
		return await this.oracle.getReserveStableToken();
	}

}

module.exports = OracleService;

