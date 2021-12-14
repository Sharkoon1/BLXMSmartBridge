var express = require("express");
const Authentication = require("../middleware/Authentication");
const MonitoringController = require("../controllers/MonitoringController");

var router = express.Router();

router.get("/", Authentication.authenticateToken, MonitoringController.profitDetail);

module.exports = router;    