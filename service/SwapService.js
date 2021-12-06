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
		const PoolBalanceBSC = await this.ArbitrageServiceInstance.getPoolPriceBSC();
		const PoolBalanceETH = await this.ArbitrageServiceInstance.getPoolPriceETH();
		return PoolBalanceBSC > PoolBalanceETH ? 1 : 0;
	}

	async swapViaBridge(Network,amount, publicAddress){
		if (Network === constants.BLXM_TOKEN_ADDRESS_BSC){
			await this.BridgeServiceInstance.swapBLXMTokenEthToBsc(amount);   
			await this.BridgeServiceInstance.wallet_BSC.transfer(publicAddress, utility.toWei(amount)); 
		} else {
			await this.BridgeServiceInstance.swapBLXMTokenBscToEth(amount);   
			await this.BridgeServiceInstance.wallet_ETH.transfer(publicAddress, utility.toWei(amount)); 
		}
	}
 

	async swap(OutputNetwork, amount, publicAddress){	
		// Get the address of the expensive Network
		const ExpensiveNetwork = await this.getExpensiveNetwork() ? constants.BLXM_TOKEN_ADDRESS_BSC : constants.BLXM_TOKEN_ADDRESS_ETH;
		// Check whether the swap is targeting the expensiv network
		const swapToExpensiveNetwork = ExpensiveNetwork === OutputNetwork ? true : false;
		
		if (swapToExpensiveNetwork){
			// A swap is happening towards the expensive network, thus the bridge will be utilized
			await this.swapViaBridge(OutputNetwork,amount, publicAddress);
		} else {
			let pool_price_bsc = await this.getPoolPriceBSC();
			let pool_price_eth = await this.getPoolPriceETH();
			let balanceUsdcBSC = await this.getPoolBalanceUSDBSC();
			let balanceUsdcETH = await this.getPoolBalanceUSDETH();

			// A swap is happening towards the cheap network 
			if (OutputNetwork === constants.BLXM_TOKEN_ADDRESS_BSC){
				const arbitrage_balance_blxm_bsc = await this.getArbitrageBalanceBlxmBSC();
				await this.ArbitrageServiceInstance.startArbitrageTransferFromETHToBSC(amount, arbitrage_balance_blxm_bsc, pool_price_bsc, pool_price_eth, balanceUsdcBSC);
				await this.BridgeServiceInstance.wallet_BSC.transfer(publicAddress, utility.toWei(amount)); 
			} else
			{
				const arbitrage_balance_blxm_eth = await this.getArbitrageBalanceBlxmETH();
				await this.ArbitrageServiceInstance.startArbitrageTransferFromBSCToETH(amount, arbitrage_balance_blxm_eth, pool_price_bsc, pool_price_eth, balanceUsdcETH);
				await this.BridgeServiceInstance.wallet_ETH.transfer(publicAddress, utility.toWei(amount)); 
			}
		}
	}
}
 
module.exports = SwapService;
