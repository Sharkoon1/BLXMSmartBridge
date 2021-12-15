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
	}

	registerArbitrageJob() {
		logger.info("Register Abitrage Job ...");
		this._task = cron.schedule("*/10 * * * * *", () => {	
			this._arbitrageService.startArbitrage();
		});
	}

	startTask() {
		this._task.start();
		this._arbitrageService._isRunning = true;
	}

	stopTask() {
		this._task.stop();
		this._arbitrageService._isRunning = false;
	}
}

module.exports = new CronJobs();
