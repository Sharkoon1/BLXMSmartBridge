let express = require("express");
const cronJobs = require("../jobs/CronJobs");
let router = express.Router();

router.get("/", (req, res, next) => {
	res.send(cronJobs._arbitrageService._isRunning);
});

router.post("/", (req, res, next) => {
	cronJobs.toggleJob();
	res.send(cronJobs.taskRunning);
});

module.exports = router;