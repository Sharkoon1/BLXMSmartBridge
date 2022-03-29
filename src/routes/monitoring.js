const express = require("express");
const MonitoringController = require("../controllers/monitoringController");
const authentication = require("../middleware/authentication");

const router = express.Router();

router.get("/", authentication.authenticateToken, MonitoringController.profitDetail);

module.exports = router;
