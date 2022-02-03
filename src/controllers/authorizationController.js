const apiResponse = require("../helpers/apiResponse");
const constants = require("../constants");
const DataBaseService = require("../service/DataBaseService");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * Authorize user wallets.
 * 
 * @returns {Object}
 */
exports.login = [
	function (req, res) {
		try {

			const { account, password } = req.body;

			// Validate user input
			if (!(account && password)) {
				res.status(400).send("All input is required");
			}

			const userData = await User.findOne({ account });

			if (userData && (await bcrypt.compare(password, userData.password))) {
				// Create token
				const token = jwt.sign(
				  { user_id: user._id, account },
				  process.env.TOKEN_KEY,
				  {
					expiresIn: "2h",
				  }
				);
		  
				// save user token
				userData.token = token;
		  
				// user
				return apiResponse.successResponseWithData(res, "Login succesful.", {user: userData});
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
 exports.register = [
	function (req, res) {
		try {
			const { account, password } = req.body;

			encryptedPassword = await bcrypt.hash(password, 10);

			const authorizedWallet = await User.findOne({ account });

			if(!authorizedWallet) {
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
				token: token,
				isRegistered: true
			}, User);

            return apiResponse.successResponse(res, "Registered succesfully");
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
 exports.isRegistered = [
	function (req, res) {
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
];