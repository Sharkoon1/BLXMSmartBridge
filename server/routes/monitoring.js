var express = require("express");
const MonitoringController = require("../controllers/MonitoringController");

var router = express.Router();

router.get("/", MonitoringController.profitDetail);

module.exports = router;    