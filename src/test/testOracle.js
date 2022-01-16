require("dotenv").config();
const constants = require("../constants");
const OracleContract = require("../contracts/OracleContract");

const UniswapOracle = new OracleContract("ETH", constants.BLXM_TOKEN_ADDRESS_ETH, constants.USD_TOKEN_ADRESS_ETH);
const PancakeOracle = new OracleContract("BSC", constants.BLXM_TOKEN_ADDRESS_BSC, constants.USD_TOKEN_ADRESS_BSC);

UniswapOracle.getPrice().then((res)=>{
	console.log("Price Uniswap");
	console.log(res);
});
UniswapOracle.getReserves().then((res)=>{
	console.log("Reserves Uniswap");
	console.log(res);
});
PancakeOracle.getPrice().then((res)=>{
	console.log("Price Pancakeswap");
	console.log(res);
});
PancakeOracle.getReserves().then((res)=>{
	console.log("Reserves Pancakeswap");
	console.log(res);
});
