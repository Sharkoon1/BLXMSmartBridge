const uniswapAbi = require("../abi/uniswap_abi.json");
const tokenAbi = require("../abi/erc20_abi.json");
const uniswapLiquidityAbi = require("../abi/uniswapLiquidity_abi.json")
const Web3 = require('web3');


class OracleUniswap {

	constructor(stableTokenAddress="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48") {
		this.stableTokenAddress = stableTokenAddress;
		this.BLXMTokenAddress = "0x38d9eb07a7b8df7d86f440a4a5c4a4c1a27e1a08";
		this.WETHTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" 
		this.UniswapContract = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
		this.UniswapLiquidityPool = "0xE0a97733F90d089df8EeE74a8723d96196fC4931";
		this.web3 = new Web3("https://mainnet.infura.io/v3/f18fcafb7053463d9183260a2bdbf968");

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
		let WETHToSell = this.web3.utils.toWei("1", "ether");
		let WETHInUSDC;
		let tokenInWETH;
		try {
			let router = await new this.web3.eth.Contract(uniswapAbi, this.UniswapContract);
			tokenInWETH = await router.methods.getAmountsOut(tokensToSell, [this.BLXMTokenAddress, this.WETHTokenAddress]).call();
			WETHInUSDC = await router.methods.getAmountsOut(WETHToSell, [this.WETHTokenAddress, this.stableTokenAddress]).call();
			WETHInUSDC = +(WETHInUSDC[1])/10**13;
			tokenInWETH = this.web3.utils.fromWei(tokenInWETH[1]);
		} catch (error) {
			console.log("An error occured");
			console.log(error);
		}


		return WETHInUSDC*tokenInWETH*10**7;

	}

	async getReserveBLXM() {
		console.log("Uniswap BLXM Reserves");
		let liquidityPool = await new this.web3.eth.Contract(uniswapLiquidityAbi, this.UniswapLiquidityPool);
		return +((await liquidityPool.methods.getReserves().call())[0]) / 10 ** 18;
	}

	async getReserveStableToken() {
		console.log("Uniswap USDC Reserves");
		let liquidityPool = await new this.web3.eth.Contract(uniswapLiquidityAbi, this.UniswapLiquidityPool);
		return +((await liquidityPool.methods.getReserves().call())[1]) / 10 ** 18;
	}
}

module.exports = OracleUniswap;