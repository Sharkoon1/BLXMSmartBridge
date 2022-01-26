var express = require("express");
const slippageController = require("../controllers/slippageController");

var router = express.Router();

router.post("/", slippageController.setSlippageWindow);
router.get("/", slippageController.getSlippageWindow);

module.exports = router;    