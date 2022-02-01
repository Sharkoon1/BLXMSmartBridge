const apiResponse = require("../helpers/apiResponse");
const dataService = require("../service/dataService");

/**
 * Get prices for tokens on both networks. 
 * 
 * @returns {Object}
 */
exports.price = [
	async function (req, res) {
		try {
			let UniData = await dataService.getPrice("ETH");
			let PancakeData = await dataService.getPrice("BSC");
			return await apiResponse.successResponseWithData(res, "Operation success", { UniBLXMPrice: UniData, PancakeBLXMPrice: PancakeData });
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.liquidity = [
	async function (req, res) {
		try {
			let BSCBalance = await dataService.getTokenBalance("BSC");
			let BSCStableBalance = BSCBalance[0];
			let BSCBasicBalance = BSCBalance[1];
			let BSCTokenNames = await dataService.getTokenNamesArbitrage("BSC");
			let BSCStableName = BSCTokenNames[0];
			let BSCBasicName = BSCTokenNames[1];
			let ETHBalance = await dataService.getTokenBalance("ETH");
			let ETHStableBalance = ETHBalance[0];
			let ETHBasicBalance = ETHBalance[1];
			let ETHTokenNames = await dataService.getTokenNamesArbitrage("ETH");
			let ETHStableName = ETHTokenNames[0];
			let ETHBasicName = ETHTokenNames[1];
			let BSCWalletBalance = await dataService.getWalletBalance("BSC");
			let ETHWalletBalance = await dataService.getWalletBalance("ETH");
			return await apiResponse.successResponseWithData(res, "Operation success", {
				BSCStable: BSCStableBalance,
				BSCBasic: BSCBasicBalance,
				ETHStable: ETHStableBalance,
				ETHBasic: ETHBasicBalance,
				ETHBalance: ETHWalletBalance,
				BSCBalance: BSCWalletBalance,
				NameBSCStable: BSCStableName,
				NameBSCBasic: BSCBasicName,
				NameETHStable: ETHStableName,
				NameETHBasic: ETHBasicName
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.poolData = [
	async function (req, res) {
		try {
			let liquidities = await dataService.getLiquidity();
			let bscTokenNames = await dataService.getTokenNamesLiquidity("BSC");
			let bscStableName = bscTokenNames[0];
			let bscBasicName = bscTokenNames[1];
			let ethTokenNames = await dataService.getTokenNamesLiquidity("ETH");
			let ethStableName = ethTokenNames[0];
			let ethBasicName = ethTokenNames[1];
			let poolAddresses = await dataService.getPoolAddresses();
			let result = {
				bscStableName: bscStableName,
				bscBasicName: bscBasicName,
				ethStableName: ethStableName,
				ethBasicName: ethBasicName,
				liquidities: liquidities,
				poolAddresses: poolAddresses
			};
			return await apiResponse.successResponseWithData(res, "Operation success", result);
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

