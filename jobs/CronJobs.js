const CronJob = require("cron").CronJob;
const WalletContainer = require("../wallet/WalletContainer");
const ArbitrageService = require("../service/ArbitrageService");
const BridgeService = require("../service/BridgeService");

class CronJobs {
	constructor(jobConfig) {
		let bridgeService = new BridgeService(WalletContainer);
		this._arbitrageService = new ArbitrageService(bridgeService, WalletContainer);
		this._jobConfig = jobConfig;
		this._jobIsRunning = false;
	}

	registerArbitrageJob() {
		let job = new CronJob("*/10 * * * * *", function() {
			if(!this._jobIsRunning) {
				this._jobIsRunning = true;
				//this._arbitrageService.startArbitrage();   
			}
		}, function() { 
			this._jobIsRunning = false;
		}, true, "Europe/Berlin");

		job.start();
	}
}

module.exports = CronJobs;
