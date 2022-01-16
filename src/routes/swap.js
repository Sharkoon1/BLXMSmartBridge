var express = require("express");
const SwapController = require("../controllers/SwapController");

var router = express.Router();

router.post("/", SwapController.swap);
router.get("/:currentNetwork", SwapController.liquidity);

module.exports = router;    