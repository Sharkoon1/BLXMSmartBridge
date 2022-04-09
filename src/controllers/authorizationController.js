const apiResponse = require("../helpers/apiResponse");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

/**
 * Authorize user wallets.
 *
 * @returns {Object}
 */
exports.login = [
	async function (req, res) {
		try {
			const { account } = req.body;

			// Validate user input
			if (!(account)) {
				res.status(400).send("All input is required");
			}

			const userData = await User.findOne({ account });

			if (userData) {
				// Create token
				let token;
				token = jwt.sign(
					{user_id: userData._id, account: userData.account},
					process.env.TOKEN_SECRET,
					{
						expiresIn: "2h",
					}
				);

				return apiResponse.successResponseWithData(res, "Login succesful.", {token: token});
			}

			return apiResponse.unauthorizedResponse(res, "Invalid credentials.");

		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * Authorize user wallets.
 *
 * @returns {Object}
 */
 /* exports.register = [
	async function (req, res) {
		try {
			const { account, password } = req.body;

			let encryptedPassword = await bcrypt.hash(password, 10);

			const user = await User.findOne({ account });

			if(!user) {
				return apiResponse.unauthorizedResponse(res, "User is not authorized to connect.");
			}

			// Create token
			const token = jwt.sign(
				{ user_id: user._id, account },
				process.env.TOKEN_KEY,
				{
					expiresIn: "2h",
				}
			);

			DataBaseService.AddData({
				account: account,
				password: encryptedPassword,
				isRegistered: true
			}, User);

            return apiResponse.successResponse(res, "Registered succesfully");
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
]; */

/**
 * Authorize user wallets.
 *
 * @returns {Object}
 */
/*  exports.isRegistered = [
	async function (req, res) {
		try {
			const { account } = req.query.account;

			const userData = await User.findOne({ account });

			if(!userData) {
				return apiResponse.unauthorizedResponse(res, "User is not authorized to connect.");
			}

            return apiResponse.successResponseWithData(res, "Registered succesfully", {isRegistered: userData.isRegistered});
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}
]; */
