let express = require("express");
const Authentication = require("../middleware/Authentication");
const ArbitrageService = require("../service/ArbitrageService");
const BridgeService = require("../service/BridgeService");
const Contracts = require("../contracts/Contracts");
const walletContainer = require("../wallet/WalletContainer");

let router = express.Router();


router.post("/", (req, res, next) => {
	let _ethContracts = new Contracts("ETH", walletContainer.ArbitrageWalletETH);
	let _bscContracts = new Contracts("BSC", walletContainer.ArbitrageWalletBSC);
	let BridgeServiceInstance = new BridgeService(walletContainer);
	let ArbitrageServiceInstance = new ArbitrageService(BridgeServiceInstance, walletContainer);
	let poolPriceBsc;
	let poolPriceEth;
	(async () => {
		poolPriceBsc = await _bscContracts.getPoolPrice();
		poolPriceEth = await _ethContracts.getPoolPrice();
		ArbitrageServiceInstance._startArbitrageCycle(poolPriceBsc, poolPriceEth);
	})();
});

module.exports = router;





