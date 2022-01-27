let express = require("express");
const ArbitrageController = require("../controllers/ArbitrageController");

let router = express.Router();

router.post("/single", ArbitrageController.startSingleArbitrage);
router.post("/toggle",  ArbitrageController.toggleArbitrage);
router.get("/status", ArbitrageController.currentArbitrageStatus);
router.post("/singleStep", ArbitrageController.singleStep);
router.post("/stopStep", ArbitrageController.stopStep);
router.get("/stepStatus", ArbitrageController.getStepStatus);

module.exports = router;





