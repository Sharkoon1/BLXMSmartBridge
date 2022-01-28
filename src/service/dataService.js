const mongoose = require("mongoose");
const PoolPrice = require("../models/PoolPrice");
const DataBaseService = require("../service/DataBaseService");
const BigNumber  = require("bignumber.js");
const Contracts = require("../contracts/contracts");

class DataService {

	constructor(queryIntervalSeconds = 10) {
		this._databaseService = DataBaseService;
		this._ethContracts = new Contracts("ETH");
		this._bscContracts = new Contracts("BSC");

		setInterval(this.getPoolData.bind(this), queryIntervalSeconds * 1000);
		this.slippageWindow = 60;
	}

	getPoolData() {
		this._ethContracts.oracleContract.getPrice().then((res) => {
			const price = res.toNumber();
			this._databaseService.AddData({
				PoolPrice: price,
				Network: "ETH",
			}, PoolPrice);
		});
		this._bscContracts.oracleContract.getPrice().then((res) => {
			const price = res.toNumber();
			this._databaseService.AddData({
				PoolPrice: price,
				Network: "BSC",
			}, PoolPrice);
		});
	}

	getSeconds(seconds) {
		var timestamp = new Date(Date.now() - seconds  * 1000);
		var hexSeconds = Math.floor(timestamp / 1000).toString(16);
		// Create an ObjectId with that hex timestamp
		return mongoose.Types.ObjectId(hexSeconds + "0000000000000000");
	}

	async getPrice(network) {
		let from = this.slippageWindow * 60;
		var priceHistory = [];
		//get data from db
		let earlierConstructedObjectId = this.getSeconds(from);
		let laterConstructedObjectId = this.getSeconds(0);

		let query = {
			"_id": { $gt: earlierConstructedObjectId, $lt: laterConstructedObjectId },
			"Network": network
		};
		try {
			let priceQuery = await this._databaseService.QueryData(query, PoolPrice);
			priceQuery.forEach(element => {
				let dateTimeArray = element.createdAt.toJSON().split("T");
				let date = dateTimeArray[0].split("-").reverse().join(".");
				let time = dateTimeArray[1].split(".")[0].split(":").slice(0, 2).join(":");
				priceHistory.push({ "Price": element.PoolPrice, "Timestamp": date + ", " + time });
			});
			return priceHistory.length > 0 ?  priceHistory : 0;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	async getStandardDeviation(network) {
		let from = this.slippageWindow * 60;
		var priceHistory = [];
		//get data from db
		let earlierConstructedObjectId = this.getSeconds(from);
		let laterConstructedObjectId = this.getSeconds(0);

		let query = {
			"_id": { $gt: earlierConstructedObjectId, $lt: laterConstructedObjectId },
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