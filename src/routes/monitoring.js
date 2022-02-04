var express = require("express");
const MonitoringController = require("../controllers/MonitoringController");
const authentication = require("../middleware/authentication");

var router = express.Router();

router.get("/", authentication.authenticateToken, MonitoringController.profitDetail);

module.exports = router;    