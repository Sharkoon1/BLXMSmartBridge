let express = require("express");
const Contracts = require("../contracts/Contracts");
const constants = require("../constants");


const BSC = "bnbt";
const _ethContracts = new Contracts("ETH");
const _bscContracts = new Contracts("BSC");

let router = express.Router();


router.post("/", (req, res) => {
	const currentNetwork = req.body.currentNetwork;
	const targetContract = currentNetwork === BSC ? _ethContracts : _bscContracts;
	targetContract.blxmTokenContract.getTokenBalance(constants.BRIDGE_WALLET_ADDRESS).then((result) => {
		if (!result.isZero()) {
			res.status(200).send("success");
		} else {
			res.status(400).send("failure");
		}
	});
});

module.exports = router;