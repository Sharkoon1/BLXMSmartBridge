let express = require("express");
const cronJobs = require("../jobs/CronJobs");
let router = express.Router();


router.get("/", (req, res, next) => {
	res.send(cronJobs.taskRunning);
	console.log("Page load ",cronJobs.taskRunning);
});

router.post("/", (req, res, next) => {
	console.log("Before ",cronJobs.taskRunning);
	if (!cronJobs.taskRunning){
		cronJobs.startTask();
	} else {
		cronJobs.stopTask();
	}
	console.log("After ",cronJobs.taskRunning);
	res.send(cronJobs.taskRunning);
});

module.exports = router;