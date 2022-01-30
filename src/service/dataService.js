const mongoose = require("mongoose");
const PoolPrice = require("../models/PoolPrice");
const DataBaseService = require("../service/DataBaseService");
const BigNumber = require("bignumber.js");
const OracleContract = require("../contracts/OracleContract");
const ArbitrageContract = require("../contracts/ArbitrageContract");
const TokenContract = require("../contracts/tokenContract");
const ethers = require("ethers");

class DataService {

	constructor() {
		this._databaseService = DataBaseService;

		this._oracleContractBsc = null;
		this._oracleContractEth = null;

		this.slippageWindow = 60;
	}

	async getLiquidity() {
		let UniswapReserves = await this._oracleContractEth.getReserves();
		let UniswapStableBalance = UniswapReserves[0].toString();
		let UniswapBLXMBalance = UniswapReserves[1].toString();
		let PancakeswapReserves = await this._oracleContractBsc.getReserves();
		let PancakeswapStableBalance = PancakeswapReserves[0].toString();
		let PancakeswapBLXMBalance = PancakeswapReserves[1].toString();
		return {
			UniswapStables: UniswapStableBalance,
			UniswapBLXM: UniswapBLXMBalance,
			PancakeswapStable: PancakeswapStableBalance,
			PancakeswapBLXM: PancakeswapBLXMBalance
		}
	}

	async getWalletBalance(network) {
		let arbitrageContract = new ArbitrageContract(network);
		let walletBalance = await arbitrageContract.getWalletBalance();
		return ethers.utils.formatEther(walletBalance);
	}


	async getTokenBalance(network) {
		let arbitrageContract = new ArbitrageContract(network);
		let stableTokenSupply = await arbitrageContract.getStableBalance()
		stableTokenSupply = ethers.utils.formatEther(stableTokenSupply);
		let basicTokenSupply = await arbitrageContract.getBasicBalance()
		basicTokenSupply = ethers.utils.formatEther(basicTokenSupply);
		return [stableTokenSupply, basicTokenSupply]
	}

	async getTokenNamesArbitrage(network) {
		let arbitrageContract = new ArbitrageContract(network);
		let stableTokenName = await arbitrageContract.getStableName()
		let basicTokenName = await arbitrageContract.getBasicName()
		return [stableTokenName, basicTokenName]
	}

	async getTokenNamesLiquidity(network) {
		let arbitrageContract = new ArbitrageContract(network);
		let oracle = network === "BSC" ? this._oracleContractBsc : (network === "ETH" ? this._oracleContractEth : null) 
		let basicToken = new TokenContract(oracle.basicTokenAddress, arbitrageContract.signer);
		let stableToken = new TokenContract(oracle.stableTokenAddress, arbitrageContract.signer);
		let stableTokenName = await stableToken.getName();
		let basicTokenName = await basicToken.getName();
		return [stableTokenName, basicTokenName];
	}

	async init() {
		let arbitrageContractEth = new ArbitrageContract("ETH");
		let arbitrageContractBsc = new ArbitrageContract("BSC");

		let basicTokenAddressEth = await arbitrageContractEth.getBasicAddress();
		let stableTokenAddressEth = await arbitrageContractEth.getStableAddress();
		this._oracleContractEth = new OracleContract("ETH", basicTokenAddressEth, stableTokenAddressEth);

		let basicTokenAddressBsc = await arbitrageContractBsc.getBasicAddress();
		let stableTokenAddressBsc = await arbitrageContractBsc.getStableAddress();
		this._oracleContractBsc = new OracleContract("BSC", basicTokenAddressBsc, stableTokenAddressBsc);
	}

	async getPoolData() {
		if (this._oracleContractBsc === null || this._oracleContractEth === null) {
			await this.init();
		}

		this._oracleContractEth.getPrice().then((res) => {
			const price = res.toString();
			this._databaseService.AddData({
				PoolPrice: price,
				Network: "ETH",
			}, PoolPrice);
		});
		this._oracleContractBsc.getPrice().then((res) => {
			const price = res.toString();
			this._databaseService.AddData({
				PoolPrice: price,
				Network: "BSC",
			}, PoolPrice);
		});
	}

	getSeconds(seconds) {
		var timestamp = new Date(Date.now() - seconds * 1000);
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
			return priceHistory.length > 0 ? priceHistory : 0;
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
				priceHistory.push(new BigNumber(element.PoolPrice));
			});
			let standardDeviation = priceHistory.length > 0 ? this.CalculateStandardDeviation(priceHistory) : 0;
			return standardDeviation;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}


	CalculateStandardDeviation(array) {
		const n = array.length;
		const mean = array.reduce((a, b) => a.plus(b)).div(n);
		return array.map(x => x.minus(mean).pow(2)).reduce((a, b) => a.plus(b)).div(n).sqrt();
	}
}

module.exports = new DataService();