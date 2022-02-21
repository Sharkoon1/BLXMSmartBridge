const apiResponse = require("../helpers/apiResponse");
const ArbitrageService = require("../service/arbitrageServiceV2");
const BigNumber = require("bignumber.js");

/**
 * Sets the setSwapAmountStatus.
 *  
 * @returns {Object}
 */
 exports.getMaxSwapAmountStatus = [
	function (req, res) {
        try { 

			let maxSwapAmountBasic;
			let maxSwapAmountStable;
			
			if(ArbitrageService.maxSwapAmountBasic === null ) maxSwapAmountBasic = 0;
			if(ArbitrageService.maxSwapAmountStable === null ) maxSwapAmountStable = 0;

			maxSwapAmountBasic = ArbitrageService.maxSwapAmountBasic;
			maxSwapAmountStable = ArbitrageService.maxSwapAmountStable;

			return apiResponse.successResponseWithData(res, "success", {checked: ArbitrageService.switchMaxSwapAmount, maxSwapAmountBasic: maxSwapAmountBasic, maxSwapAmountStable: maxSwapAmountStable});
            
			
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Sets the MaxSwapAmount.
 *  
 * @returns {Object}
 */
 exports.switchMaxSwapAmountOn = [
	function (req, res) {
        try {
			ArbitrageService.switchMaxSwapAmount = req.body.checked;
			if (!ArbitrageService.switchMaxSwapAmount){
				ArbitrageService.maxSwapAmountBsc = null;
				ArbitrageService.maxSwapAmountEth = null;
			}
			return apiResponse.successResponse(res, "Switch max swap amount was set sucessfuly");
			
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Sets the MaxSwapAmountValues.
 *  
 * @returns {Object}
 */
 exports.setMaxSwapAmountValues = [
	function (req, res) {
		
        try {
			let maxSwapAmountBasic = req.body.maxSwapAmountBasic;
			let maxSwapAmountStable = req.body.maxSwapAmountStable;

			ArbitrageService.maxSwapAmountBasic = new BigNumber(maxSwapAmountBasic !== null ? maxSwapAmountBasic : 0);
			ArbitrageService.maxSwapAmountStable = new BigNumber(maxSwapAmountStable !== null ? maxSwapAmountStable : 0);
 
			return apiResponse.successResponse(res, "Max swap amount was set sucessfuly");
			
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
