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

			let maxSwapAmountBsc;
			let maxSwapAmountEth;
			
			if(ArbitrageService.maxSwapAmountBsc == null ) maxSwapAmountBsc = 0;
			if(ArbitrageService.maxSwapAmountEth == null ) maxSwapAmountEth = 0;

			maxSwapAmountBsc = ArbitrageService.maxSwapAmountBsc;
			maxSwapAmountEth = ArbitrageService.maxSwapAmountEth;

			return apiResponse.successResponseWithData(res, "success", {checked: ArbitrageService.switchMaxSwapAmount, bscMaxSwapAmount: maxSwapAmountBsc, ethMaxSwapAmount: maxSwapAmountEth});
            
			
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
			
			let ethMaxSwapAmount = req.body.ethMaxSwapAmount;
			let bscMaxSwapAmount = req.body.bscMaxSwapAmount;

            if(ethMaxSwapAmount > 0 && bscMaxSwapAmount > 0) {

				ArbitrageService.maxSwapAmountBsc = new BigNumber(bscMaxSwapAmount);
				ArbitrageService.maxSwapAmountEth = new BigNumber(ethMaxSwapAmount);

                return apiResponse.successResponse(res, "Max swap amount was set sucessfuly");
            }

            else {
                return apiResponse.validationError(res, "Max swap amount request was invalid");
            }
			
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
