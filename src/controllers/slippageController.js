const apiResponse = require("../helpers/apiResponse");
const DataService = require("../service/DataService");

/**
 * Sets the slippage Window.
 *  
 * @returns {Object}
 */
 exports.setSlippageWindow = [
	function (req, res) {
        try {
            if(req.body.slippageWindow || req.body.slippageWindow > 0) {
                DataService.slippageWindow = req.body.slippageWindow;
                
                return apiResponse.successResponse(res, "Slippage window was set sucessfuly");
            }

            else {
                return apiResponse.validationError(res, "Slippage window from request was 0 or empty", {"SlippageWindow": req.body.slippageWindow});
            }
			
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Gets the slippage Window.
 *  
 * @returns {Object}
 */
 exports.getSlippageWindow = [
	function (req, res) {
        try {
			return apiResponse.successResponseWithData(res, "success", { "SlippageWindow": DataService.slippageWindow });
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
