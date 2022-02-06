const apiResponse = require("../helpers/apiResponse");
const ArbitrageService = require("../service/arbitrageServiceV2");
const BigNumber  = require("bignumber.js");

const one = new BigNumber(1);

/**
 * Sets the slippage.
 *  
 * @returns {Object}
 */
 exports.setSlippage = [
	function (req, res) {
        try {
            if(req.body.slippageEth || req.body.slippageEth > 0 &&  req.body.slippageBsc || req.body.slippageBsc > 0 ) {

				ArbitrageService.slippageBsc = one.minus(new BigNumber(req.body.slippageBsc).dividedBy(100)); 
				ArbitrageService.slippageEth = one.minus(new BigNumber(req.body.slippageEth).dividedBy(100));

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

			let slippageBsc = (one.minus(ArbitrageService.slippageBsc)).multipliedBy(100);
			let slippageEth = (one.minus(ArbitrageService.slippageEth)).multipliedBy(100);

			return apiResponse.successResponseWithData(res, "success",  { slippage:  {bsc: slippageBsc.toString(), eth: slippageEth.toString()}});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
