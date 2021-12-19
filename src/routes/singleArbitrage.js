let express = require("express");
const cronJobs = require("../jobs/CronJobs");

let router = express.Router();


router.post("/", (req, res, next) => {
	cronJobs.singleArbitrage();
});

module.exports = router;





