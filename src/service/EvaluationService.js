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

			return minimumSwapAmountUSD;
    
		} else {
			return -1;
		}
    
	}
}

module.exports = EvaluationService;