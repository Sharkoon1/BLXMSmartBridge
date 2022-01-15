let express = require("express");
const ArbitrageController = require("../controllers/ArbitrageController");

let router = express.Router();

router.post("/single", ArbitrageController.startSingleArbitrage);
router.post("/toggle",  ArbitrageController.toggleArbitrage);
router.get("/status", ArbitrageController.currentArbitrageStatus);

module.exports = router;





