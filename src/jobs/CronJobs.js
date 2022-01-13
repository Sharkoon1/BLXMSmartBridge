var cron = require("node-cron");
const logger = require("../logger/logger");
const ArbitrageService = require("../service/ArbitrageServiceV1");
const BridgeService = require("../service/BridgeService");

class CronJobs {
	constructor() {
		let bridgeService = new BridgeService();
		this._arbitrageService = new ArbitrageService(bridgeService);
		this._task;
		this.taskRunning = false;
	}

	registerArbitrageJob() {
		logger.info("Register Abitrage Job ...");
		this._task = cron.schedule("*/10 * * * * *", () => {	
			this._arbitrageService.startArbitrage();
		});
		this._task.stop();
	}

	singleArbitrage() {
		this._arbitrageService.startSingleArbitrageCycle();
	}

	toggleJob() {
		if (!this.taskRunning) {
			this.taskRunning = true;
			this._arbitrageService._stopCycle = false;
			this._arbitrageService.startArbitrage();
		} else {
			this.taskRunning = false;
			this._arbitrageService._stopCycle = true;
		}
	}
}

module.exports = new CronJobs();
