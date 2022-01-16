const apiResponse = require("../helpers/apiResponse");

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
			res.sendStatus(200);
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
			res.sendStatus(200);
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];