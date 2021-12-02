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
			await this.BridgeServiceInstance.swapBLXMTokenEthToBsc(amount)   
			await this.BridgeServiceInstance.wallet_BSC.transfer(publicAddress, utility.toWei(amount)); 
		} else {
			await this.BridgeServiceInstance.contract_blxm_token_bsc.transfer(constants.BRIDGE_WALLET_ADDRESS, utility.toWei(amount));    
			await this.BridgeServiceInstance.bridge_wallet_contract_blxm_token_eth.transfer(publicAddress, utility.toWei(amount)); 
		}
	}
 

	async swap(OutputNetwork, amount, pulicAddress){	
		// Get the address of the expensive Network
		const ExpensiveNetwork = await this.getExpensiveNetwork() ? constants.BLXM_TOKEN_ADDRESS_BSC : constants.BLXM_TOKEN_ADDRESS_ETH;
		// Check whether the swap is targeting the expensiv network
		const swapToExpensiveNetwork = ExpensiveNetwork === OutputNetwork ? true : false;
		
		if (swapToExpensiveNetwork){
			// A swap is happening towards the expensive network, thus the bridge will be utilized
			await this.swapViaBridge(OutputNetwork,amount, pulicAddress);
		} else {
			// A swap is happening towards the cheap network 
			if (OutputNetwork === constants.BLXM_TOKEN_ADDRESS_BSC){
				await this._startSwapToBSC(amount, publicAddress);
			} else
			{
				await this._startSwapToETH(amount);
			}
		}
	}

	
	async _startSwapToBSC(amount, publicAddress) {
		
		const balanceBlxmBSC = await this.BridgeServiceInstance.getPoolBalanceBlxmBSC();

		// If no liquidity is available in the  
		if (balanceBlxmBSC < amount) {
			return await this.swapViaBridge(constants.BLXM_TOKEN_ADDRESS_BSC,amount, publicAddress);
		} else {
			return await this.ArbitrageServiceInstance.
		}
	}

	async _startSwapToETH(amount) {
		let pool_price_bsc = await this.getPoolPriceBSC();
		let pool_price_eth = await this.getPoolPriceBSC();

		if (pool_price_bsc < pool_price_eth) {
			let arbitrage_balance_blxm_bsc = await this.getArbitrageBalanceBlxmBSC();

			let balanceBlxmBSC = await this.getPoolBalanceBlxmBSC();
			let balanceUsdcBSC = await this.getPoolBalanceUSDBSC();
			let balanceBlxmETH = await this.getPoolBalanceBlxmETH();
			let balanceUsdcETH = await this.getPoolBalanceUSDETH();

			let adjustmentValue = AdjustmentValueService.getAdjustmentValue(balanceBlxmBSC, balanceUsdcBSC, balanceBlxmETH, balanceUsdcETH);

			// is liqudity avaible ? 
			if (arbitrage_balance_blxm_bsc > 0) {
				return await this._bridgeAndSwapETH(adjustmentValue, arbitrage_balance_blxm_bsc);
			}

			// provide liqudity in bsc
			// swap and bridge usd
			else {
				let arbitrage_balance_usd_bsc = await this.getArbitrageBalanceUSDBSC();
				let arbitrage_balance_usd_eth = await this.getArbitrageBalanceUSDETH();

				// provide liquidity from cheap network via usd
				if (arbitrage_balance_usd_bsc > 0) {
				// cheap network    
					let usd_amount = pool_price_bsc * adjustmentValue;
					let usdSwapAmount = Math.min(usd_amount, balanceUsdcBSC);

					// swap in bsc usd to blxm
					await this._swapStablesToToken_BSC(usdSwapAmount);
				}

				// provide liquidity from expensive network via usd
				else if (arbitrage_balance_usd_eth > 0) {
				// expensive network                         
					let usd_amount = pool_price_eth * adjustmentValue;
					let usdSwapAmount = Math.min(usd_amount, balanceUsdcETH);

					// bridge usdc from eth to bsc
					await this.BridgeService.swapUSDTokenETH(usdSwapAmount);

					// swap usd from bsc to blxm
					await this._swapStablesToToken_ETH(usdSwapAmount);
				}

				arbitrage_balance_blxm_bsc = await this.getArbitrageBalanceBlxmBSC();

				return await this._bridgeAndSwapETH(adjustmentValue, arbitrage_balance_blxm_bsc);
			}
		}
	}
 
}
 
module.exports = SwapService;