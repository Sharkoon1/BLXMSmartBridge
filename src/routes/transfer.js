let express = require("express");
let ethers = require("ethers")
const Authentication = require("../middleware/Authentication");
const swapService = require("../service/SwapService");

let router = express.Router();

const BNC = 97;

//router.post("/transfer", Authentication.authenticateToken,  (req, res, next)=>{
//Get transaction hash and sum transferred from request body
// Check if transaction hash is not already present in database
// If transaction Hash is not present
//		Check for transaction to arrive
//		Once transaction has arrived, 
//});
router.post("/", (req, res, next) => {
	//let provider = new ethers.providers.EtherscanProvider("rinkeby");
	//provider.getHistory("0x626FB960A26681F7B0FD3E0c19D09fC440d2FF74").then(console.log);
	const address = req.body.from;
	const network = req.body.chainId === BNC ? "BTC" : "ETH";
	const amount = parseInt(req.body.data.slice(74), 16)/10**18;
	//console.log(address, network, amount);
	swapService.swap(network, amount, address).then(function () {
		res.send("success");
	});
});

module.exports = router;