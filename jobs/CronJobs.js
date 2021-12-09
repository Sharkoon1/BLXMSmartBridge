var cron = require("node-cron");
const logger = require("../logger/logger");
const WalletContainer = require("../wallet/WalletContainer");
const constants = require("../constants");
const ArbitrageService = require("../service/ArbitrageService");
const BridgeService = require("../service/BridgeService");

class CronJobs {
	constructor() {
		let bridgeService = new BridgeService(WalletContainer);
		this._arbitrageService = new ArbitrageService(bridgeService, WalletContainer);
	}

	registerArbitrageJob() {
		logger.info("Register Abitrage Job ...");
		let task = cron.schedule("*/10 * * * * *", () => {
			if(process.env.JOBS_ENABLED === constants.JOB_ENABLED_STATE) {
				this._arbitrageService.startArbitrage();
			}
		});
		task.start();
	}
}

module.exports = new CronJobs();
