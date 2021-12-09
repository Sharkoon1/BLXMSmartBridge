//const { body,validationResult } = require("express-validator");
//const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");


/**
 * Profit detail.
 * 
 * @param {string}   network
 * 
 * @returns {Object}
 */
exports.swap = [
	function (req, res) {
		if(!(req.params.network.toUpperCase() == "BSC".toUpperCase() ||  req.params.network.toUpperCase() == "ETH".toUpperCase())){
			return apiResponse.validationErrorWithData(res, "Invalid Network specified", {});
		}
		try {
			return apiResponse.successResponseWithData(res, "Operation success", {});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];