//const { body,validationResult } = require("express-validator");
//const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");


/**
 * Profit detail.
 * 
 * @returns {Object}
 */
exports.profitDetail = [
	function (req, res) {
		try {
			return apiResponse.successResponseWithData(res, "Operation success", {});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];