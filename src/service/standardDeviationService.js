const mongoose = require("mongoose");
const PoolPrice = require("../models/PoolPrice");
const OracleContract = require("../contracts/oracleContract");
const { ethers } = require("ethers");

class StandardDeviationService {

	constructor(dataBaseService, queryIntervalSeconds = 10) {
		this._databaseService = dataBaseService;
		this._oracleUniswap = new OracleContract("ETH", "0x38d9eb07a7b8df7d86f440a4a5c4a4c1a27e1a08", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
		this._oraclePancakeSwap = new OracleContract("BSC", "0x40e51e0ec04283e300f12f6bb98da157bb22036e", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");
		setInterval(this.getPoolData.bind(this), queryInterval * 1000);
	}

	getPoolData() {
		this._oracleUniswap.getPrice().then((res) => {
			//console.log("Price Uniswap");
			//console.log(+res);
			DataBaseService.AddData({
				PoolPrice: +ethers.utils.formatEther(res),
				Network: "ETH",
			}, PoolPrice);
		});
		this._oraclePancakeSwap.getPrice().then((res) => {
			//console.log("Price Pancakeswap");
			//console.log(+res);
			DataBaseService.AddData({
				PoolPrice: +ethers.utils.formatEther(res),
				Network: "BSC",
			}, PoolPrice);
		});
	}

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
		//console.log(EarlierConstructedObjectId);
		let LaterConstructedObjectId = this.getSeconds(to);
		//console.log(LaterConstructedObjectId);
		let query = {
			"_id": { $gt: EarlierConstructedObjectId, $lt: LaterConstructedObjectId },
			"Network": network
		};
		try {
			let priceQuery = await this._databaseService.QueryData(query, PoolPrice);
			priceQuery.forEach(element => {
				priceHistory.push(element.PoolPrice);
			});

			return priceHistory.length > 0 ? this.CalculateStandardDeviation(priceHistory) : 0;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}


	CalculateStandardDeviation(array) {
		const n = array.length;
		const mean = array.reduce((a, b) => a + b) / n;
		return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
	}
}

module.exports = StandardDeviationService;

/* TEST CODE */
//////////////////////////////////////////////////////
/*
require("dotenv").config();
const DataBaseService = require("./DataBaseService");
let sd = new StandardDeviationService(DataBaseService);

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

sleep(3000)

let intervals = 0;
let End = 10;
let pauseSeconds = 1000;

setInterval(() => {
	sd.standardDeviation(100, 0, "ETH").then(res => console.log(`Standard Deviation ETH ${res}`));
	sd.standardDeviation(100, 0, "BSC").then(res => console.log(`Standard Deviation BSC ${res}`));
}, 5*pauseSeconds);
*/