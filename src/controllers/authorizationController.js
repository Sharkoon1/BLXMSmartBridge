const apiResponse = require("../helpers/apiResponse");
const constants = require("../constants");

/**
 * Authorize user wallets.
 * 
 * @returns {Object}
 */
exports.authorize = [
	function (req, res) {
		try {
			const authorizedUsers = constants.AUTHORIZED_WALLETS.map(element => {
				return element.toLowerCase();
			});
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