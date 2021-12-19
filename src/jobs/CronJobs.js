var cron = require("node-cron");
const logger = require("../logger/logger");
const WalletContainer = require("../wallet/WalletContainer");
const ArbitrageService = require("../service/ArbitrageService");
const BridgeService = require("../service/BridgeService");

class CronJobs {
	constructor() {
		let bridgeService = new BridgeService(WalletContainer);
		this._arbitrageService = new ArbitrageService(bridgeService, WalletContainer);
		this._task;
		this.taskRunning = false;
	}

	registerArbitrageJob() {
		logger.info("Register Abitrage Job ...");
		this._task = cron.schedule("*/10 * * * * *", () => {	
			this._arbitrageService.startArbitrage();
		});
	}

	toggleJob() {
		if (!this.taskRunning) {
			this._arbitrageService._stopCycle = false;
			this._task.startTask();
		} else {
			this._arbitrageService._stopCycle = true;
			this._task.stopTask();
		}
	}
}

module.exports = new CronJobs();
