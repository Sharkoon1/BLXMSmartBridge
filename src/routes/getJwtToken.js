const jwt = require("jsonwebtoken");
let express = require("express");

let router = express.Router();

router.get("/jwt", (req, res, next) => {
	const token = jwt.sign(
		{ user_id: user._id },
		process.env.TOKEN_KEY,
		{
			expiresIn: "2h",
		}
	);
	// save user token
	user.token = token;

	// return new user
	res.status(201).json(user);
});

module.exports = router;
