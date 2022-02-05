var express = require("express");
const slippageController = require("../controllers/slippageController");
const authentication = require("../middleware/authentication");

var router = express.Router();

router.post("/", authentication.authenticateToken, slippageController.setSlippage);
router.get("/", authentication.authenticateToken, slippageController.getSlippage);

module.exports = router;    