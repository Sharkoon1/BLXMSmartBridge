const { ethers } = require("ethers");
const logger = require("../logger/logger");
const constants = require("../constants");
const StandardDeviationService = require("./StandardDeviationService");

class EvaluationService {

	constructor(databaseService) {
		this._databaseService = databaseService;
		this._standardDeviationService = new StandardDeviationService(this._databaseService);
	}

	async minimumSwapAmount(poolPriceBsc, poolPriceEth, totalBlxmEth, totalBlxmBsc, totalUsdcEth, totalUsdcBsc){
		poolPriceBsc = ethers.utils.formatEther(poolPriceBsc);
		poolPriceEth = ethers.utils.formatEther(poolPriceEth);

		//Transaction fees in USD 
		let feeSwaps = {tokenToStablesETH: 0.13, stablesToTokenETH: 0.14, tokenToStablesBSC: 0.12, stablesToTokenBSC: 0.15}; // Swap gasfee in USD 
		let feeBridge = {fromETHtoBSC: 0.14, fromBSCtoETH: 0.12};                                                            // Bridge gasfee in USD 
    
		//Transactions per cycle
		let transactions = await this._countTransactionsPerCycle(poolPriceBsc, poolPriceEth, totalBlxmEth, totalBlxmBsc, totalUsdcEth, totalUsdcBsc);
		let swapsTransaction = transactions[0];
		let bridgeTransactions = transactions[1];
    
		//Calculate transaction fees per cycle 
		//Fees ETH 
		let feesSwapETH = swapsTransaction.tokenToStablesETH * feeSwaps.tokenToStablesETH + swapsTransaction.stablesToTokenETH * feeSwaps.stablesToTokenBSC;
		let feesBridgeETH = feeBridge.fromETHtoBSC * bridgeTransactions.fromETHtoBSC;
    
		//Fees BSC 
		let feesSwapBSC = swapsTransaction.tokenToStablesBSC * feeSwaps.tokenToStablesBSC + swapsTransaction.stablesToTokenBSC * feeSwaps.stablesToTokenBSC;
		let feesBridgeBSC = feeBridge.fromBSCtoETH * bridgeTransactions.fromBSCtoETH;
    
		//Sum fees
		let sumFees = feesSwapETH + feesBridgeETH + feesSwapBSC + feesBridgeBSC;
    
		// Calculate minumum swap amount 
		// Minimum minimumSwapAmount = X = -( TXcost )/(priceCheapBLXM  + standardDeviation  - priceExpensiveBLXM)
		// Whereas priceCheapBLXM  + standardDeviationCheapBLXM <= priceExpensiveBLXM

		let priceExpensiveBLXM;
		let priceCheapBLXM;
    
		if(poolPriceBsc > poolPriceEth){
			priceExpensiveBLXM = poolPriceBsc;
			priceCheapBLXM = poolPriceEth;
		} else {
			priceExpensiveBLXM = poolPriceEth;
			priceCheapBLXM = poolPriceBsc;
		}
        
		let standardDeviation = this._standardDeviationService.getStandardDeviation();
    
		if (priceCheapBLXM + standardDeviation <  priceExpensiveBLXM) {
			var minimumSwapAmountUSD = -( sumFees )/(priceCheapBLXM  + standardDeviation  - priceExpensiveBLXM); 
			var minimumSwapAmountBLXM  = minimumSwapAmountUSD / priceCheapBLXM;

			logger.info("Minimum swap amount usd: " + minimumSwapAmountUSD);
			logger.info("Minimum swap amount blxm: " + minimumSwapAmountBLXM);

			return {minimumSwapAmountUSD: minimumSwapAmountUSD, minimumSwapAmountBLXM: minimumSwapAmountBLXM};
    
		} else {
			return -1;
		}
    
	}

	async _countTransactionsPerCycle(poolPriceBsc, poolPriceEth, totalBlxmEth, totalBlxmBsc, totalUsdcEth, totalUsdcBsc){

		let swapsTransaction = {tokenToStablesETH: 0, stablesToTokenETH: 0, tokenToStablesBSC: 0, stablesToTokenBSC: 0};
		let bridgeTransactions = {fromETHtoBSC: 0, fromBSCtoETH: 0};
		let transactions = [swapsTransaction, bridgeTransactions];


		//evaluates which path the Arbitrage bot chooses to perform the value Adjustment
		if (poolPriceBsc > poolPriceEth) {
			if (!totalBlxmEth.isZero()) { 
				//first option: two transactions (one bridge in ETH -> one swap in BSC)
				bridgeTransactions.fromETHtoBSC = 1;    // Bridge calculated amount to expensive_BLXM_network
				swapsTransaction.tokenToStablesBSC = 1; // Add bridged cheap_BLXM to expensive_BLXM LP
			}
            
			else {
				if (!totalUsdcEth.isZero()) { 
					//second option: three transactions (one swap in ETH -> one bridge in ETH -> one swap in BSC)
					swapsTransaction.stablesToTokenETH = 1; // Swap USDC to cheap_BLXM
					bridgeTransactions.fromETHtoBSC = 1;        // Bridge calculated amount to expensive_BLXM_network
					swapsTransaction.tokenToStablesBSC = 1; // Add bridged cheap_BLXM to expensive_BLXM LP
				}

				else {
					//third option: four transactions (one bridge in BSC -> one swap in ETH -> one bridge in ETH -> one swap in BSC)
					bridgeTransactions.fromBSCtoETH = 1;    // Bridge USDC to cheap_BLXM_network
					swapsTransaction.stablesToTokenETH = 1; // Swap USDC to cheap_BLXM
					bridgeTransactions.fromETHtoBSC = 1;    // Bridge calculated amount to expensive_BLXM_network
					swapsTransaction.tokenToStablesBSC = 1; // Add bridged cheap_BLXM to expensive_BLXM LP
				}
			}
		}
		else if (poolPriceEth > poolPriceBsc){
			if (!totalBlxmBsc.isZero()) { 
				//first option: two transactions (one bridge in BSC -> one swap in ETH)
				bridgeTransactions.fromBSCtoETH = 1;    // Bridge calculated amount to expensive_BLXM_network
				swapsTransaction.tokenToStablesETH = 1; // Add bridged cheap_BLXM to expensive_BLXM LP
			}
			else {
				if (!totalUsdcBsc.isZero()) { 
					//second option: three transactions (one swap in BSC -> one bridge in BSC -> one swap in ETH)
					swapsTransaction.stablesToTokenBSC = 1; // Swap USDC to cheap_BLXM
					bridgeTransactions.fromBSCtoETH = 1;    // Bridge calculated amount to expensive_BLXM_network
					swapsTransaction.tokenToStablesETH = 1; // Add bridged cheap_BLXM to expensive_BLXM LP
				}
				else{
					//third option: four transactions (one bridge in ETH -> one swap in BSC -> one bridge in BSC -> one swap in ETH)
					bridgeTransactions.fromETHtoBSC = 1;    // Bridge USDC to cheap_BLXM_network
					swapsTransaction.stablesToTokenBSC = 1; // Swap USDC to cheap_BLXM
					bridgeTransactions.fromBSCtoETH = 1;    // Bridge calculated amount to expensive_BLXM_network
					swapsTransaction.tokenToStablesETH = 1; // Add bridged cheap_BLXM to expensive_BLXM LP
				}
			}
		}

		else {
			return false;
		}

		return transactions;
	}
}

module.exports = EvaluationService;