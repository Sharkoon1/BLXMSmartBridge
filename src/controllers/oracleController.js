const apiResponse = require("../helpers/apiResponse");
const DataBaseService = require("../service/DataBaseService");
const dataService = require("../service/dataService");

/**
 * Get prices for tokens on both networks. 
 * 
 * @returns {Object}
 */
exports.price = [
	function (req, res) {
		try {
			const tempdataService = new dataService(DataBaseService);
			let UniData;
			let PancakeData;
			(async ()=>{
				UniData = await tempdataService.getETHPrice();
				PancakeData = await tempdataService.getBSCPrice();
				return apiResponse.successResponseWithData(res, "Operation success", { "UniBLXMPrice": UniData, "PancakeBLXMPrice": PancakeData });
			})();
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
