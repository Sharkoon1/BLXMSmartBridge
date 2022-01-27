const apiResponse = require("../helpers/apiResponse");
const constants = require("../constants")

/**
 * Authorize user wallets.
 * 
 * @returns {Object}
 */
exports.authorize = [
	function (req, res) {
		try {
			let authorizedUsers = constants.AUTHORIZED_WALLETS;
			let user = req.body.User.toLowerCase();
			if (authorizedUsers.indexOf(user) !== -1) {
                return apiResponse.successResponse(res, "Authorized successfuly");
            }
            else {
                return apiResponse.unauthorizedResponse(res, "User not authorized");
            }
			
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];