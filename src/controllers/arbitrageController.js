const apiResponse = require("../helpers/apiResponse");
const ArbitrageService = require("../service/ArbitrageServicev2");


/**
 * Start single arbitrage.
 *  
 * @returns {Object}
 */
exports.startSingleArbitrage = [
	function (req, res) {
        try {
			res.sendStatus(200);
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * Toggle arbitrage cycle.
 *  
 * @returns {Object}
 */
 exports.toggleArbitrage = [
	function (req, res) {
        try {
			if(ArbitrageService.isRunning) {
				this.stopCycle = true;

				return apiResponse.successResponseWithData(res, "stopping the cycle", { "ArbitrageCycleStatus": ArbitrageService.isRunning });
			}

			else { 
				ArbitrageService.startArbitrage();

				return apiResponse.successResponseWithData(res, "started the arbitrage service", { "ArbitrageCycleStatus": ArbitrageService.isRunning });
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Gets the current Arbitrage status.
 *  
 * @returns {Object}
 */
 exports.currentArbitrageStatus = [
	function (req, res) {
        try {
			return apiResponse.successResponseWithData(res, "success", { "ArbitrageCycleStatus": ArbitrageService.isRunning });
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];