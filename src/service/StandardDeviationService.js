const mongoose = require("mongoose");
const DataBaseService = require("./DataBaseService");
const PoolPrice = require("../models/PoolPrice");

class StandardDeviationService {

	averageStandardDeviation() {
		var averageStandardDeviation = ((standardDeviationETH() + standardDeviationBSC()) / 2);
		return averageStandardDeviation;
	};


	getSeconds(seconds) {
		var timestamp = new Date(Date.now() - seconds * 60 * 1000);
		var hexSeconds = Math.floor(timestamp / 1000).toString(16);
		// Create an ObjectId with that hex timestamp
		return mongoose.Types.ObjectId(hexSeconds + "0000000000000000");
	}



	async standardDeviation(from, to, network) {

		var priceHistory = [];
		//get data from db
		let EarlierConstructedObjectId = this.getSeconds(from);
		console.log(EarlierConstructedObjectId);
		let LaterConstructedObjectId = this.getSeconds(to);
		console.log(LaterConstructedObjectId);
		let query = {
			"_id": { $gt: EarlierConstructedObjectId, $lt: LaterConstructedObjectId },
			"Network": network
		}
		try {
			let priceQuery = await DataBaseService.QueryData(query, PoolPrice);
			priceQuery.forEach(element => {
				priceHistory.push(element.PoolPrice)
			})

			return this.CalculateStandardDeviation(priceHistory);
		} catch (err) {
			console.log(err);
			throw err;
		}
	};


	CalculateStandardDeviation(numbersArr) {

		//calculate average 
		var total = 0;
		for (var key in numbersArr)
			total += numbersArr[key];
		var meanVal = total / numbersArr.length;


		//calculate standard deviation
		var SDprep = 0;
		for (var key in numbersArr)
			SDprep += Math.pow((parseFloat(numbersArr[key]) - meanVal), 2);
		var SDresult = Math.sqrt(SDprep / numbersArr.length);

		return SDresult;
	}
}

module.exports = StandardDeviationService;

/* TEST CODE */
//////////////////////////////////////////////////////
/*
let sd = new StandardDeviationService();

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

let intervals = 0;
let End = 10;
let pauseSeconds = 1000;

setInterval(() => {
	DataBaseService.AddData({
		PoolPrice: 1,
		Network: "ETH",
	}, PoolPrice);
	intervals++;
	if (intervals === End) {
		clearInterval(this);
		console.log(sd.standardDeviationETH(10, 0));
	}
}, pauseSeconds);
*/