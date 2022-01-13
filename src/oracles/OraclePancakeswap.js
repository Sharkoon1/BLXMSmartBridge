const pancakeSwapAbi = require("../abi/pancakeswap_abi.json");
const tokenAbi = require("../abi/beb20_abi.json");
const pancakeSwapLiquidityAbi = require("../abi/pancakeswapLiquidity_abi.json")
const Web3 = require('web3');


class OraclePancakeswap {

	constructor(stableTokenAddress="0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d") {
		this.stableTokenAddress = stableTokenAddress;
		this.BLXMTokenAddress = "0x40e51e0ec04283e300f12f6bb98da157bb22036e";
		this.BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" 
		this.pancakeSwapContract = "0x10ED43C718714eb63d5aA57B78B54704E256024E"
		this.pancakeSwapLiquidityPool = "0xD617cc09A85dC93De9FB1487ac8863936c5E511F";
		this.web3 = new Web3("https://bsc-dataseed1.binance.org");

	}

	setDecimals(number, decimals) {
		number = number.toString();
		let numberAbs = number.split('.')[0]
		let numberDecimals = number.split('.')[1] ? number.split('.')[1] : '';
		while (numberDecimals.length < decimals) {
			numberDecimals += "0";
		}
		return numberAbs + numberDecimals;
	}

	async getPrice() {

		let tokenRouter = await new this.web3.eth.Contract(tokenAbi, this.BLXMTokenAddress);
		let tokenDecimals = await tokenRouter.methods.decimals().call();
		let tokensToSell = this.setDecimals(1, tokenDecimals);
		let bnbToSell = this.web3.utils.toWei("1", "ether");
		let BNBInUSDC;
		let tokenInBNB;
		try {
			let router = await new this.web3.eth.Contract(pancakeSwapAbi, this.pancakeSwapContract);
			tokenInBNB = await router.methods.getAmountsOut(tokensToSell, [this.BLXMTokenAddress, this.BNBTokenAddress]).call();
			BNBInUSDC = await router.methods.getAmountsOut(bnbToSell, [this.BNBTokenAddress, this.stableTokenAddress]).call();
			BNBInUSDC = this.web3.utils.fromWei(BNBInUSDC[1]);
			tokenInBNB = this.web3.utils.fromWei(tokenInBNB[1]);
		} catch (error) {
			console.log("An error occured");
			console.log(error);
		}


		return tokenInBNB * BNBInUSDC;

	}

	async getReserveBLXM() {
		console.log("Reserves");
		let liquidityPool = await new this.web3.eth.Contract(pancakeSwapLiquidityAbi, this.pancakeSwapLiquidityPool);
		return +((await liquidityPool.methods.getReserves().call())[0]) / 10 ** 18;
	}

	async getReserveStableToken() {
		console.log("Reserves");
		let liquidityPool = await new this.web3.eth.Contract(pancakeSwapLiquidityAbi, this.pancakeSwapLiquidityPool);
		return +((await liquidityPool.methods.getReserves().call())[1]) / 10 ** 18;
	}
}

module.exports = OraclePancakeswap;