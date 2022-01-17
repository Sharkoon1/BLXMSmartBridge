const apiResponse = require("../helpers/apiResponse");
//const swapService = require("../service/SwapService");
const Contracts = require("../contracts/Contracts");
const constants = require("../constants");

/**
 * Swap transfer.
 * 
 * @param {string}   network
 * 
 * @returns {Object}
 */
exports.swap = [
	function (req, res) {
		try {
			const BSC = 97;

			const address = req.body.from;
			const network = req.body.chainId === BSC ? "ETH" : "BSC";
			const amount = parseInt(req.body.data.slice(74), 16)/10**18;
			//swapService.swap(network, amount, address).then(function () {
			//	res.send("success");
			//});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Gets the bridge liquidity.
 * 
 * @param {string}   network
 * 
 * @returns {Object}
 */
 exports.liquidity = [
	function (req, res) {
		try {			
			const _ethContracts = new Contracts("ETH");
			const _bscContracts = new Contracts("BSC");

			const currentNetwork = req.params.currentNetwork; 
			const targetContract = currentNetwork === "bnbt" ? _ethContracts : _bscContracts;
			targetContract.blxmTokenContract.getTokenBalance(constants.BRIDGE_WALLET_ADDRESS).then((result) => {
				if (!result.isZero()) {
					res.status(200).send("success");
				} else {
					res.status(400).send("failure");
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];