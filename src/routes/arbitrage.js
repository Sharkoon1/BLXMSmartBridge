let express = require("express");
const ArbitrageController = require("../controllers/ArbitrageController");
const authentication = require("../middleware/authentication");
let router = express.Router();

router.post("/single", ArbitrageController.startSingleArbitrage);
router.post("/toggle",  ArbitrageController.toggleArbitrage);
router.get("/status", authentication.authenticateToken, ArbitrageController.currentArbitrageStatus);
router.post("/singleStep", ArbitrageController.singleStep);
router.post("/stopStep", ArbitrageController.stopStep);
router.get("/stepStatus", authentication.authenticateToken, ArbitrageController.getStepStatus);

module.exports = router;





