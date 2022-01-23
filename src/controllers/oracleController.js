const apiResponse = require("../helpers/apiResponse");
const dataService = require("../service/dataService");
const Contracts = require("../contracts/Contracts");
const constants = require("../constants");

/**
 * Swap transfer.
 * 
 * @param {string}   network
 * 
 * @returns {Object}
 */
exports.price = [
	function (req, res) {
		try {
			
			const UniData = {"Price":,"Timestamp:"};
			const PancakeData = {"Price":,"Timestamp:"};
			return apiResponse.successResponseWithData(res, "Operation success", {"UniBLXMPrice":UniData,"PancakeBLXMPrice":PancakeData});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
