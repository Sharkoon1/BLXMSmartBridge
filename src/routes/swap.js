var express = require("express");
const Authentication = require("../middleware/Authentication");
const SwapController = require("../controllers/SwapController");

var router = express.Router();

router.get("/:network", Authentication.authenticateToken, SwapController.swap);

module.exports = router;    