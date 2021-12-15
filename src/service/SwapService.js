const logger = require("../logger/logger");
const { ethers } = require("ethers");

const ArbitrageService = require("./ArbitrageService");
const AdjustmentValueService = require("./AdjustmentValueService");
const BridgeService = require("./BridgeService");
const Contracts = require("../contracts/Contracts");
const constants = require("../constants");
const walletContainer = require("../wallet/WalletContainer");
const EvaluationService = require("./EvaluationService");


class SwapService {

	constructor() {
		this._ethContracts = new Contracts("ETH", walletContainer.ArbitrageWalletETH);
		this._bscContracts = new Contracts("BSC", walletContainer.ArbitrageWalletBSC);
		this.BridgeServiceInstance = new BridgeService(walletContainer);
		this._evaluationService = new EvaluationService(this._databaseService);
		this.ArbitrageServiceInstance = new ArbitrageService(this.BridgeServiceInstance, walletContainer);
	}

	async getExpensiveNetwork() {
		// return 1 if BSC is the expensive network, otherwise ETH is more expensive 
		const PoolBalanceBSC = await this._bscContracts.getPoolPrice();
		const PoolBalanceETH = await this._ethContracts.getPoolPrice();
		return PoolBalanceBSC > PoolBalanceETH ? 1 : 0;
	}

	async swapViaBridge(Network, amount, publicAddress) {
		if (Network === "BSC") {
			await this.BridgeServiceInstance.bridgeBLXMTokenEthToBsc(amount);
			await this._bscContracts.blxmTokenContract.transferTokens(publicAddress, amount);
		} else {
			await this.BridgeServiceInstance.bridgeBLXMTokenBscToEth(amount);
			await this._ethContracts.blxmTokenContract.transferTokens(publicAddress, amount);
		}
	}

	/**
	 * 
	 * @param {string} outputNetwork - Either "BSC" or "ETH" 
	 * @param {number} amount - Amount of tokens to swap
	 * @param {string} publicAddress - Hexadecimal address of recipient on other network
	 */
	async swap(outputNetwork, amount, publicAddress) {
		// Convert passed number to BigNumber
		amount = ethers.utils.parseEther(String(amount));
		// Get the address of the expensive Network
		const ExpensiveNetwork = await this.getExpensiveNetwork() ? "BSC" : "ETH";
		// Check whether the swap is targeting the expensive network TODO wrong comparison
		const swapToExpensiveNetwork = ExpensiveNetwork === outputNetwork ? true : false;

		if (swapToExpensiveNetwork) {
			// A swap is happening towards the expensive network, thus the bridge will be utilized
			await this.swapViaBridge(outputNetwork, amount, publicAddress);
		} else {
			let poolPriceBsc = await this._bscContracts.getPoolPrice();
			let poolPriceEth = await this._ethContracts.getPoolPrice();

			let totalPoolBlxmBSC = await this._bscContracts.getPoolNumberOfBlxmToken();
			let totalPoolUsdcBSC = await this._bscContracts.getPoolNumberOfUsdToken();
			let totalPoolBlxmETH = await this._ethContracts.getPoolNumberOfBlxmToken();
			let totalPoolUsdcETH = await this._ethContracts.getPoolNumberOfUsdToken();
		
			let totalArbitrageBlxmBsc = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let totalArbitrageBlxmEth = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let totalArbitrageUsdcBsc = await this._bscContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let totalArbitrageUsdcEth = await this._ethContracts.usdTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			let adjustmentValue;
			let adjustmentValueUsd;

			let minimumSwapAmountValue = await this._evaluationService.minimumSwapAmount(poolPriceBsc, poolPriceEth, totalArbitrageBlxmEth, totalArbitrageBlxmBsc, totalArbitrageUsdcEth, totalArbitrageUsdcBsc);

			// A swap is happening towards the cheap network 
			if (outputNetwork === "BSC") {
				adjustmentValue = AdjustmentValueService.getAdjustmentValue(totalPoolBlxmBSC, totalPoolBlxmBSC, totalPoolBlxmETH, totalPoolUsdcETH);
				adjustmentValueUsd = AdjustmentValueService.getAdjustmentValueUsd(totalPoolBlxmBSC, totalPoolBlxmBSC, totalPoolBlxmETH, totalPoolUsdcETH);

				await this.startArbitrageTransferFromBscToEth(adjustmentValue, adjustmentValueUsd, totalArbitrageBlxmBsc, totalArbitrageUsdcEth, totalArbitrageUsdcBsc, totalPoolUsdcETH, minimumSwapAmountValue);
				const exchangeRate = poolPriceEth/poolPriceBsc;
				let profit = amount.mul(ethers.utils.parseEther(exchangeRate.toString())).div(ethers.utils.parseEther((10**18).toString())).sub(amount);
				await this._bscContracts.blxmTokenContract.transferTokens(publicAddress, amount.add(profit).div(2));
			} else {
				adjustmentValue = AdjustmentValueService.getAdjustmentValue(totalPoolBlxmETH, totalPoolUsdcETH, totalPoolBlxmBSC, totalPoolUsdcBSC);
				adjustmentValueUsd = AdjustmentValueService.getAdjustmentValueUsd(totalPoolBlxmETH, totalPoolUsdcETH, totalPoolBlxmBSC, totalPoolUsdcBSC);

				await this.startArbitrageTransferFromEthToBsc(adjustmentValue, adjustmentValueUsd, totalArbitrageBlxmEth, totalArbitrageUsdcEth, totalArbitrageUsdcBsc, totalPoolUsdcBSC, minimumSwapAmountValue);
				const exchangeRate = poolPriceBsc/poolPriceEth;
				let profit = amount.mul(ethers.utils.parseEther(exchangeRate.toString())).div(ethers.utils.parseEther((10**18).toString())).sub(amount);
				await this._ethContracts.blxmTokenContract.transferTokens(publicAddress, amount.add(profit).div(2));
			}
		}
	}
}

module.exports = new SwapService();