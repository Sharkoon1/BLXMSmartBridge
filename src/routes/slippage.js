var express = require("express");
const slippageController = require("../controllers/slippageController");

var router = express.Router();

router.post("/", slippageController.setSlippage);
router.get("/", slippageController.getSlippage);

module.exports = router;    