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
            if(req.body.ETHMax || req.body.BSCMax > 0) {
				console.log(req.body.ETHMax)
				console.log(req.body.BSCMax)
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
