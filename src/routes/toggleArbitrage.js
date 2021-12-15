let express = require("express");
const cronJobs = require("../jobs/CronJobs");
let router = express.Router();


router.get("/", (req, res, next) => {
	res.send(cronJobs._arbitrageService._isRunning);
	console.log("Page load ",cronJobs._arbitrageService._isRunning);
});

router.post("/", (req, res, next) => {
	console.log("Before ",cronJobs._arbitrageService._isRunning);
	if (!cronJobs._arbitrageService._isRunning){
		cronJobs.startTask();
	} else {
		cronJobs.stopTask();
	}
	console.log("After ",cronJobs._arbitrageService._isRunning);
	res.send(cronJobs._arbitrageService._isRunning);
});

module.exports = router;