const ArbitrageService = require("./ArbitrageService");
const BridgeService = require("./BridgeService");
const constants = require("../constants");
const utility = require("../helpers/utility");
require("dotenv").config();


class SwapService {

	constructor() {
		this.BridgeServiceInstance = new BridgeService();
		this.ArbitrageServiceInstance = new ArbitrageService(this.BridgeServiceInstance);
	}

	async getExpensiveNetwork() {
		// return 1 if BSC is the expensive network, otherwise ETH is more expensive 
		const PoolBalanceBSC = await this.ArbitrageServiceInstance._bscContracts.getPoolPrice();
		const PoolBalanceETH = await this.ArbitrageServiceInstance._ethContracts.getPoolPrice();
		return PoolBalanceBSC > PoolBalanceETH ? 1 : 0;
	}

	async swapViaBridge(Network, amount, publicAddress) {
		if (Network === constants.BLXM_TOKEN_ADDRESS_BSC) {
			await this.BridgeServiceInstance.bridgeBLXMTokenEthToBsc(amount);
			await this.BridgeServiceInstance._walletContainer.BridgeWalletBSC.transfer(publicAddress, utility.toWei(amount));
		} else {
			await this.BridgeServiceInstance.bridgeBLXMTokenBscToEth(amount);
			await this.BridgeServiceInstance._walletContainer.BridgeWalletETH.transfer(publicAddress, utility.toWei(amount));
		}
	}


	async swap(OutputNetwork, amount, publicAddress) {
		// Get the address of the expensive Network
		const ExpensiveNetwork = await this.getExpensiveNetwork() ? constants.BLXM_TOKEN_ADDRESS_BSC : constants.BLXM_TOKEN_ADDRESS_ETH;
		// Check whether the swap is targeting the expensive network
		const swapToExpensiveNetwork = ExpensiveNetwork === OutputNetwork ? true : false;

		if (swapToExpensiveNetwork) {
			// A swap is happening towards the expensive network, thus the bridge will be utilized
			await this.swapViaBridge(OutputNetwork, amount, publicAddress);
		} else {
			let pool_price_bsc = await this.ArbitrageServiceInstance._bscContracts.getPoolPrice();
			let pool_price_eth = await this.ArbitrageServiceInstance._ethContracts.getPoolPrice();

			let balanceUsdcBSC = await this.ArbitrageServiceInstance._bscContracts.getPoolNumberOfUsdToken();
			let balanceUsdcETH = await this.ArbitrageServiceInstance._ethContracts.getPoolNumberOfUsdToken();

			// A swap is happening towards the cheap network 
			if (OutputNetwork === constants.BLXM_TOKEN_ADDRESS_BSC) {
				const arbitrage_balance_blxm_bsc = await this._bscContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
				await this.ArbitrageServiceInstance.startArbitrageTransferFromETHToBSC(amount, arbitrage_balance_blxm_bsc, pool_price_bsc, pool_price_eth, balanceUsdcBSC);
				const exchangeRate = pool_price_eth / pool_price_bsc;
				let profit = (exchangeRate * amount) - amount
				await this.BridgeServiceInstance._walletContainer.BridgeWalletBSC.transfer(publicAddress, utility.toWei(amount + profit / 2));
			} else {
				const arbitrage_balance_blxm_eth = await this.ArbitrageServiceInstance._ethContracts.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_WALLET_ADDRESS);
				await this.ArbitrageServiceInstance.startArbitrageTransferFromBSCToETH(amount, arbitrage_balance_blxm_eth, pool_price_bsc, pool_price_eth, balanceUsdcETH);
				const exchangeRate = pool_price_bsc / pool_price_eth;
				let profit = (exchangeRate * amount) - amount
				await this.BridgeServiceInstance._walletContainer.BridgeWalletETH.transfer(publicAddress, utility.toWei(amount + profit / 2));
			}
		}
	}
}

module.exports = SwapService;
