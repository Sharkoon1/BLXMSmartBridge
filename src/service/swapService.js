const { ethers } = require("ethers");
const ArbitrageService = require("./ArbitrageServiceV1");
const BridgeService = require("./BridgeService");
const Contracts = require("../contracts/Contracts");
const constants = require("../constants");
const EvaluationService = require("./EvaluationService");


class SwapService {

	constructor() {
		this._ethContracts = new Contracts("ETH");
		this._bscContracts = new Contracts("BSC");
		
		this.BridgeServiceInstance = new BridgeService();
		this._evaluationService = new EvaluationService(this._databaseService);
		this.ArbitrageServiceInstance = new ArbitrageService(this.BridgeServiceInstance);
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
		// Check whether the swap is targeting the expensive network 
		const swapToExpensiveNetwork = ExpensiveNetwork === outputNetwork ? true : false;

		if (swapToExpensiveNetwork) {
			// A swap is happening towards the expensive network, thus the bridge will be utilized
			await this.swapViaBridge(outputNetwork, amount, publicAddress);
		} else {
			let poolPriceBsc = await this._bscContracts.getPoolPrice();
			let poolPriceEth = await this._ethContracts.getPoolPrice();

			let totalArbitrageBlxmBsc = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
			let totalArbitrageBlxmEth = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);

			// A swap is happening towards the cheap network 
			if (outputNetwork === "BSC") {
				if (!totalArbitrageBlxmBsc.isZero()) {
					await this.ArbitrageServiceInstance._bridgeAndSwapToBsc(amount);
					const exchangeRate = ethers.utils.formatEther(poolPriceEth) / ethers.utils.formatEther(poolPriceBsc);
					const amountEther =  Number(ethers.utils.formatEther(amount));
					let profit = amountEther * exchangeRate - amountEther;
					return await this._bscContracts.blxmTokenContract.transferTokens(publicAddress, ethers.utils.parseEther(String(amountEther + profit / 2)));

				} else {
					await this.swapViaBridge(outputNetwork, amount, publicAddress);
				}
			} else if (outputNetwork === "ETH") {
				if (!totalArbitrageBlxmEth.isZero()) {
					await this.ArbitrageServiceInstance._bridgeAndSwapToEth(amount);
					const exchangeRate = ethers.utils.formatEther(poolPriceBsc) / ethers.utils.formatEther(poolPriceEth);
					const amountEther = Number(ethers.utils.formatEther(amount));
					let profit = amountEther * exchangeRate - amountEther;
					return await this._ethContracts.blxmTokenContract.transferTokens(publicAddress, ethers.utils.parseEther(String(amountEther + profit / 2)));

				} else {
					await this.swapViaBridge(outputNetwork, amount, publicAddress);
				}
			}
		}
	}
}

module.exports = new SwapService();