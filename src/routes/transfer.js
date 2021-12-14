let express = require("express");
const Authentication = require("../middleware/Authentication");

let router = express.Router();

router.post("/transfer", Authentication.authenticateToken,  (req, res, next)=>{
//Get transaction hash and sum transferred from request body
// Check if transaction hash is not already present in database
// If transaction Hash is not present
//		Check for transaction to arrive
//		Once transaction has arrived, 
});

module.exports = router;    

/*
let provider = new ethers.providers.EtherscanProvider("ropsten");
let history = await provider.getHistory(address);
*/