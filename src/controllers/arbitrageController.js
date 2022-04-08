const apiResponse = require("../helpers/apiResponse");
const ArbitrageService = require("../service/arbitrageServiceV2");
const SingleStepArbitrageService = require("../service/singleStepArbitrageService");

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
				ArbitrageService.stopCycle = true;

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

/**
 * Single step arbitrage mode.
 *
 * @returns {Object}
 */
 exports.singleStep = [
	function (req, res) {
        try {
			let stepStatus = req.body.stepStatus;

            if(stepStatus) {
                SingleStepArbitrageService.startSingleStepArbitrage(stepStatus).then( () => {
					return apiResponse.successResponseWithData(res, "Arbitrage step status: " + stepStatus + " has been successful.", {stepStatus: stepStatus});
				});
            }
            else {
                return apiResponse.validationError(res, "Arbitrage step status was missing.", {stepStatus: stepStatus});
            }

		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Sets the single step status.
 *
 * @returns {Object}
 */
 exports.stopStep = [
	function (req, res) {
        try {
			SingleStepArbitrageService.resetSingleStepArbitrage().then(() => {
				return apiResponse.successResponse(res, "Arbitrage step status has been stopped.");
			});
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Gets the arbitrage single step status.
 *
 * @returns {Object}
 */
 exports.getStepStatus = [
	function (req, res) {
        try {
			return apiResponse.successResponseWithData(res, "success", { stepStatus: SingleStepArbitrageService.stepStatus });
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
