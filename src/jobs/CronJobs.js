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

	startTask() {
		this._arbitrageService._stopCycle = false;
		this._task.start();
		this.taskRunning = true;
	}

	stopTask() {
		this._task.stop();
		this.taskRunning = false;
		this._arbitrageService._stopCycle = true;
	}
}

module.exports = new CronJobs();
