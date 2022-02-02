const apiResponse = require("../helpers/apiResponse");

/**
 * Sets the slippage.
 *  
 * @returns {Object}
 */
 exports.setSlippage = [
	function (req, res) {
        try {
            if(req.body.slippageEth || req.body.slippageEth > 0 &&  req.body.slippageBsc || req.body.slippageBsc > 0 ) {
               // DataService.slippageWindow = req.body.slippageWindow;
                
                return apiResponse.successResponse(res, "Slippage window was set sucessfuly");
            }

            else {
                return apiResponse.validationError(res, "Slippage window from request was 0 or empty", { slippage:  {bsc: 5, eth: 6}});
            }
			
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Gets the slippage.
 *  
 * @returns {Object}
 */
 exports.getSlippage= [
	function (req, res) {
        try {
			return apiResponse.successResponseWithData(res, "success",  { slippage:  {bsc: 5, eth: 6}});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
