const mongoose = require("mongoose");
const PoolPrice = require("../models/PoolPrice");
const OracleContract = require("../contracts/oracleContract");
const DataBaseService = require("../service/DataBaseService");
const constants = require("../constants");
const BigNumber  = require("bignumber.js");

class DataService {

	constructor(queryIntervalSeconds = 10) {
		this._databaseService = DataBaseService;
		this._oracleUniswap = new OracleContract("ETH", constants.BLXM_TOKEN_ADDRESS_ETH, constants.USD_TOKEN_ADDRESS_ETH);
		this._oraclePancakeSwap = new OracleContract("BSC", constants.BLXM_TOKEN_ADDRESS_BSC, constants.USD_TOKEN_ADDRESS_BSC);
		setInterval(this.getPoolData.bind(this), queryIntervalSeconds * 1000);
		this.cachedUniswapPrice = {};
		this.cachedPancakePrice = {};
		this.slippageWindow = 60;
	}

	getPoolData() {
		this._oracleUniswap.getPrice().then((res) => {
			const price = res.toNumber();
			let dateTimeArray = new Date().toJSON().split("T");
			let date = dateTimeArray[0].split("-").reverse().join(".");
			let time = dateTimeArray[1].split(".")[0].split(":").slice(0, 2).join(":");
			this.cachedUniswapPrice = { "Price": price, "Timestamp": date + ", " + time };
			this._databaseService.AddData({
				PoolPrice: price,
				Network: "ETH",
			}, PoolPrice);
		});
		this._oraclePancakeSwap.getPrice().then((res) => {
			const price = res.toNumber();
			let dateTimeArray = new Date().toJSON().split("T");
			let date = dateTimeArray[0].split("-").reverse().join(".");
			let time = dateTimeArray[1].split(".")[0].split(":").slice(0, 2).join(":");
			this.cachedPancakePrice = { "Price": price, "Timestamp": date + ", " + time };
			this._databaseService.AddData({
				PoolPrice: price,
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

	getETHPrice() {
		return this.cachedUniswapPrice;
	}

	getBSCPrice() {
		return this.cachedPancakePrice;
	}

	async getStandardDeviation(network) {
		let from = this.slippageWindow * 60;
		var priceHistory = [];
		
		//get data from db
		let EarlierConstructedObjectId = this.getSeconds(from);
		let LaterConstructedObjectId = this.getSeconds(0);

		let query = {
			"_id": { $gt: EarlierConstructedObjectId, $lt: LaterConstructedObjectId },
			"Network": network
		};
		try {
			let priceQuery = await this._databaseService.QueryData(query, PoolPrice);
			priceQuery.forEach(element => {
				priceHistory.push(element.PoolPrice);
			});
			let standardDeviation = priceHistory.length > 0 ? this.CalculateStandardDeviation(priceHistory) : 0;
			return new BigNumber(standardDeviation);
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

module.exports = new DataService();

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