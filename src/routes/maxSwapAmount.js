var express = require("express");
const maxSwapAmountController = require("../controllers/maxSwapAmountController");
const authentication = require("../middleware/authentication");

var router = express.Router();

router.post("/", authentication.authenticateToken, maxSwapAmountController.switchMaxSwapAmountOn);
router.post("/values", authentication.authenticateToken, maxSwapAmountController.setMaxSwapAmountValues);
router.get("/", authentication.authenticateToken, maxSwapAmountController.getMaxSwapAmountStatus);

module.exports = router;    