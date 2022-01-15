let express = require("express");
let router = express.Router();
const ArbitrageController = require("../controllers/ArbitrageController");

router.post("/single", ArbitrageController.singleArbitrage);
router.post("/toggle",  ArbitrageController.toggleArbitrage);
router.get("/status", ArbitrageController.currentArbitrageStatus);

module.exports = router;





