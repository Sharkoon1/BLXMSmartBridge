const apiResponse = require("../helpers/apiResponse");
const ArbitrageService = require("../service/arbitrageServiceV2");
const BigNumber  = require("bignumber.js");

/**
 * Sets the slippage.
 *  
 * @returns {Object}
 */
 exports.setSlippage = [
	function (req, res) {
        try {
            if(req.body.slippageEth || req.body.slippageEth > 0 &&  req.body.slippageBsc || req.body.slippageBsc > 0 ) {
                ArbitrageService.slippageBsc = new BigNumber(req.body.slippageBsc);
				ArbitrageService.slippageEth = new BigNumber(req.body.slippageEth);

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
 * Gets the slippage.
 *  
 * @returns {Object}
 */
 exports.getSlippage= [
	function (req, res) {
        try {
			return apiResponse.successResponseWithData(res, "success",  { slippage:  {bsc: ArbitrageService.slippageBsc.toString(), eth: ArbitrageService.slippageEth.toString()}});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
