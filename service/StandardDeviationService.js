const mongoose = require("mongoose");
const DataBaseService = require("./DataBaseService");
const PoolPrice = require("../models/PoolPrice");
var ObjectID = require('mongodb').ObjectID;

class StandardDeviationService {

	constructor() {
		this.db = new DataBaseService();
	}

	averageStandardDeviation() {
		var averageStandardDeviation = ((standardDeviationETH() + standardDeviationBSC()) / 2);
		return averageStandardDeviation;
	};


	getSeconds(seconds) {
		var timestamp = new Date(Date.now() - seconds * 60 * 1000);
		var hexSeconds = Math.floor(timestamp / 1000).toString(16);
		// Create an ObjectId with that hex timestamp
		return ObjectID(hexSeconds + "0000000000000000");
	}



	standardDeviationETH(from, to) {

		var priceHistoryETH = [];
		//get data from db
		let EarlierConstructedObjectId = this.getSeconds(from);
		console.log(EarlierConstructedObjectId);
		let LaterConstructedObjectId = this.getSeconds(to);
		let query = {
			"_id": { $gt: EarlierConstructedObjectId, $lt: LaterConstructedObjectId },
			"Network": "ETH"
		}
		var priceHistoryETH = this.db.QueryData(query, PoolPrice);
		console.log(priceHistoryETH);
		//var standardDeviationETH = CalculateStandardDeviation(priceHistoryETH);
		//return standardDeviationETH;
	};


	standardDeviationBSC() {

		var priceHistoryBSC = [];
		//get data from db
		var priceHistoryBSC = DataBaseService.QueryData(
			"db.posts.find({ created_on: { $gte: new Date(2012, 7, 14), $lt: new Date(2012, 7, 15)}})", PoolPrice
		);

		var standardDeviationBSC = CalculateStandardDeviation(priceHistoryBSC);
		return standardDeviationBSC;
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
	sd.db.AddData({
		PoolPrice: 1,
		Network: "ETH",
	}, PoolPrice);
	intervals++;
	if (intervals===End){
		clearInterval(this);
		sd.standardDeviationETH(10, 0);
	}
}, pauseSeconds);
