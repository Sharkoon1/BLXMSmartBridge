require("dotenv").config();
const constants = require("../constants");
const OracleContract = require("../contracts/OracleContract");
const { _construct } = require("../logger/logger");


class test{
	
constructor(){

	this.UniswapOracle = new OracleContract("ETH", constants.BLXM_TOKEN_ADDRESS_ETH, constants.USD_TOKEN_ADRESS_ETH);
	this.PancakeOracle = new OracleContract("BSC", constants.BLXM_TOKEN_ADDRESS_BSC, constants.USD_TOKEN_ADRESS_BSC);

	this.poolPriceEth = null;
	this.poolPriceBsc = null;
	
	this.amountStableEth = null;
	this.amountBasicEth = null;

	this.amountStableBsc = null;
	this.amountBasicBsc = null;

}

async startTest(){

	
	this.poolPriceEth = await this.UniswapOracle.getPrice()
	console.log("poolPriceEth: " + this.poolPriceEth);

	this.poolPriceBsc = await this.PancakeOracle.getPrice()
	console.log("poolPriceBsc: " + this.poolPriceBsc);

	this.amountStableEth = await this.UniswapOracle.getReserves();
	console.log("amountStableEth: " + this.amountStableEth)

	this.amountBasicEth = await this.UniswapOracle.getReserves();
	console.log("amountBasicEth: " + this.amountStableEth[1])

	this.amountStableBsc = await this.PancakeOracle.getReserves();
	console.log("amountStableBsc: " + this.amountStableBsc[0])

	this.amountBasicBsc = await this.PancakeOracle.getReserves();
	console.log("amountBasicBsc: " + this.amountStableBsc[1])
	}
}

let testObject = new test();
testObject.startTest();