var express = require("express");
const slippageController = require("../controllers/slippageController");

var router = express.Router();

router.post("/", slippageController.setSlippageWindow);

module.exports = router;    