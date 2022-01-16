require("dotenv").config();
const OracleContract = require("../contracts/OracleContract");


const UniswapOracle = new OracleContract("ETH", "0x38d9eb07a7b8df7d86f440a4a5c4a4c1a27e1a08", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
const PancakeOracle = new OracleContract("BSC", "0x40e51e0ec04283e300f12f6bb98da157bb22036e", "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");


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
