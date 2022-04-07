const apiResponse = require("../helpers/apiResponse");
const dataService = require("../service/dataService");
const constants = require("../constants");


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

			let ethWalletAddress = await dataService.getWalletAddress("ETH");
			let bscWalletAddress = await dataService.getWalletAddress("BSC");

			let BSCBalance = await dataService.getTokenBalance("BSC");
			let BSCStableBalance = BSCBalance[0];
			let BSCBasicBalance = BSCBalance[1];
			let BSCTokenNames = await dataService.getTokenNamesArbitrage("BSC");
			let BSCStableName = BSCTokenNames.stableTokenName;
			let BSCBasicName = BSCTokenNames.basicTokenName;
			let ETHBalance = await dataService.getTokenBalance("ETH");
			let ETHStableBalance = ETHBalance[0];
			let ETHBasicBalance = ETHBalance[1];
			let ETHTokenNames = await dataService.getTokenNamesArbitrage("ETH");
			let ETHStableName = ETHTokenNames.stableTokenName;
			let ETHBasicName = ETHTokenNames.basicTokenName;
			let BSCWalletBalance = await dataService.getWalletBalance("BSC");
			let ETHWalletBalance = await dataService.getWalletBalance("ETH");
			let BSCArbitrageContractAddress = await dataService.getArbitrageContractAddress("BSC");
			let ETHArbitrageContractAddress = await dataService.getArbitrageContractAddress("ETH");
			return await apiResponse.successResponseWithData(res, "Operation success", {
				ETHWalletAddress: ethWalletAddress,
				BSCWalletAddress: bscWalletAddress,
				BSCStable: BSCStableBalance,
				BSCBasic: BSCBasicBalance,
				ETHStable: ETHStableBalance,
				ETHBasic: ETHBasicBalance,
				ETHBalance: ETHWalletBalance,
				BSCBalance: BSCWalletBalance,
				NameBSCStable: BSCStableName,
				NameBSCBasic: BSCBasicName,
				NameETHStable: ETHStableName,
				NameETHBasic: ETHBasicName,
				BSCArbitrageContractAddress: BSCArbitrageContractAddress,
				ETHArbitrageContractAddress: ETHArbitrageContractAddress
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
			let bscStableName = bscTokenNames.stableTokenName;
			let bscBasicName = bscTokenNames.basicTokenName;
			let ethTokenNames = await dataService.getTokenNamesLiquidity("ETH");
			let ethStableName = ethTokenNames.stableTokenName;
			let ethBasicName = ethTokenNames.basicTokenName;
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

