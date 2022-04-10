const apiResponse = require("../helpers/apiResponse");

/**
 * Gets the current enviroment status
 *
 * @returns {Object}
 */
 exports.getEnviroment = [
	function (req, res) {
        try {
			let isProduction = process.env.NODE_ENV === "production";

			return apiResponse.successResponseWithData(res, "success", { isMainnet: isProduction});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
