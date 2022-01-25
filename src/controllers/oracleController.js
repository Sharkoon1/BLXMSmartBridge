const apiResponse = require("../helpers/apiResponse");
const dataService = require("../service/dataService");

/**
 * Get prices for tokens on both networks. 
 * 
 * @returns {Object}
 */
exports.price = [
	function (req, res) {
		try {
			let UniData = dataService.getETHPrice();
			let PancakeData = dataService.getBSCPrice();
			return apiResponse.successResponseWithData(res, "Operation success", { "UniBLXMPrice": UniData, "PancakeBLXMPrice": PancakeData });
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
