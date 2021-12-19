let express = require("express");
let ethers = require("ethers")
const Authentication = require("../middleware/Authentication");
const swapService = require("../service/SwapService");

let router = express.Router();

const BSC = 97;

//Get transaction hash and sum transferred from request body
// Check if transaction hash is not already present in database
// If transaction Hash is not present
//		Check for transaction to arrive
//		Once transaction has arrived, 
router.post("/", (req, res, next) => {
	const address = req.body.from;
	const network = req.body.chainId === BSC ? "BSC" : "ETH";
	const amount = parseInt(req.body.data.slice(74), 16)/10**18;
	swapService.swap(network, amount, address).then(function () {
		res.send("success");
	});
});

module.exports = router;