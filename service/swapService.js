const ArbitrageService = require("./ArbitrageService");
const BridgeService = require("./BridgeService");
require("dotenv").config();

const BridgeServiceInstance = new BridgeService();
const ArbitrageServiceInstance = new ArbitrageService(BridgeServiceInstance);


ArbitrageServiceInstance.getPoolBalanceBlxmBSC().then(()=>{});
