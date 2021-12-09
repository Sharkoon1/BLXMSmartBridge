var express = require("express");
const SwapController = require("../controllers/SwapController");

var router = express.Router();

router.get("/:network", SwapController.swap);

module.exports = router;    