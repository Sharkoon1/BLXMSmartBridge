const ArbitrageService = require("./ArbitrageService");
const BridgeService = require("./BridgeService");

const BridgeServiceInstance = new BridgeService();
const ArbitrageServiceInstance = new ArbitrageService(BridgeServiceInstance);


ArbitrageServiceInstance.getPoolBalanceBlxmBSC().then(()=>{});
