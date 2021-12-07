const ArbitrageService = require("./ArbitrageService");
const logger = require("../logger/logger")
const BridgeService = require("./BridgeService");
const Contracts = require("../contracts/Contracts");
const constants = require("../constants");
const walletContainer = require("../wallet/WalletContainer");
const { ethers } = require("ethers");
require("dotenv").config();


class SwapService {

	constructor() {
		this._ethContracts = new Contracts("ETH", walletContainer.ArbitrageWalletETH);
		this._bscContracts = new Contracts("BSC", walletContainer.ArbitrageWalletBSC);
		this.BridgeServiceInstance = new BridgeService(walletContainer);
		this.ArbitrageServiceInstance = new ArbitrageService(this.BridgeServiceInstance, walletContainer);
	}

	async getExpensiveNetwork() {
		// return 1 if BSC is the expensive network, otherwise ETH is more expensive 
		const PoolBalanceBSC = await this._bscContracts.getPoolPrice();
		const PoolBalanceETH = await this._ethContracts.getPoolPrice();
		return PoolBalanceBSC.gt(PoolBalanceETH) ? 1 : 0;
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

			let balanceUsdcBSC = await this._bscContracts.getPoolNumberOfUsdToken();
			let balanceUsdcETH = await this._ethContracts.getPoolNumberOfUsdToken();

			// A swap is happening towards the cheap network 
			if (outputNetwork === "BSC") {
				const arbitrageBalanceBlxmBsc = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
				await this.ArbitrageServiceInstance.startArbitrageTransferFromETHToBSC(amount, arbitrageBalanceBlxmBsc, poolPriceBsc, poolPriceEth, balanceUsdcBSC);
				const exchangeRate = poolPriceEth.div(poolPriceBsc);
				let profit = exchangeRate.mul(amount).sub(amount);
				await this._bscContracts.blxmTokenContract.transferTokens(publicAddress, amount.add(profit).div(2));
			} else {
				const arbitrageBalanceBlxmEth = await this._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
				await this.ArbitrageServiceInstance.startArbitrageTransferFromBSCToETH(amount, arbitrageBalanceBlxmEth, poolPriceBsc, poolPriceEth, balanceUsdcETH);
				const exchangeRate = poolPriceBsc.div(poolPriceEth);
				let profit = exchangeRate.mul(amount).sub(amount);
				await this._ethContracts.blxmTokenContract.transferTokens(publicAddress, amount.add(profit).div(2));
			}
		}
	}
}

/* TEST CODE */
//////////////////////////////////////////////////////


module.exports = SwapService;

const swapInstance = new SwapService();
swapInstance.swap("ETH", 1, "0xc591113a44fCF67aA205B074011fdeb862a9C755");