let express = require("express");
const cronJobs = require("../jobs/CronJobs");

let router = express.Router();


router.post("/", (req, res, next) => {
	(async () => {
		let poolPriceBsc = await cronJobs._arbitrageService._bscContracts.getPoolPrice();
		let poolPriceEth = await cronJobs._arbitrageService._ethContracts.getPoolPrice();
		cronJobs._arbitrageService._startArbitrageCycle(poolPriceBsc, poolPriceEth);
	})();
});

module.exports = router;





