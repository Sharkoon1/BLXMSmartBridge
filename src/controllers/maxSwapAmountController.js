const apiResponse = require("../helpers/apiResponse");
const ArbitrageService = require("../service/arbitrageServiceV2");


/**
 * Sets the slippage.
 *  
 * @returns {Object}
 */
 exports.switchMaxSwapAmountOn = [
	function (req, res) {
        try {
            if(req.body.checked) {

				ArbitrageService.switchMaxSwapAmount = req.body.checked;

				console.log(req.body.checked)
                return apiResponse.successResponse(res, "Slippage window was set sucessfuly");
            }

            else {
                return apiResponse.validationError(res, "Slippage window from request was 0 or empty");
            }
			
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Sets the slippage.
 *  
 * @returns {Object}
 */
 exports.setMaxSwapAmountValues = [
	function (req, res) {
		
        try {
			
			let ethMaxSwapAmount = req.body.ethMaxSwapAmount;
			let bscMaxSwapAmount = req.body.bscMaxSwapAmount;

            if(ethMaxSwapAmount || bscMaxSwapAmount > 0) {

				ArbitrageService.maxSwapAmountBsc = bscMaxSwapAmount;
				ArbitrageService.maxSwapAmountEth = ethMaxSwapAmount;

                return apiResponse.successResponse(res, "Slippage window was set sucessfuly");
            }

            else {
                return apiResponse.validationError(res, "Slippage window from request was 0 or empty");
            }
			
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
