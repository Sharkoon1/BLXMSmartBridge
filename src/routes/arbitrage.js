let express = require("express");
const ArbitrageController = require("../controllers/ArbitrageController");
const authentication = require("../middleware/authentication");
let router = express.Router();

router.post("/single", authentication.authenticateToken, ArbitrageController.startSingleArbitrage);
router.post("/toggle",  authentication.authenticateToken, ArbitrageController.toggleArbitrage);
router.get("/status", authentication.authenticateToken, ArbitrageController.currentArbitrageStatus);
router.post("/singleStep", authentication.authenticateToken, ArbitrageController.singleStep);
router.post("/stopStep", authentication.authenticateToken, ArbitrageController.stopStep);
router.get("/stepStatus", authentication.authenticateToken, authentication.authenticateToken, ArbitrageController.getStepStatus);

module.exports = router;





