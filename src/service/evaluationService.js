const { ethers } = require("ethers");
const logger = require("../logger/logger");
const StandardDeviationService = require("./StandardDeviationService");

class EvaluationService {

	constructor(databaseService) {
		this._databaseService = databaseService;
		this._standardDeviationService = new StandardDeviationService(this._databaseService);
	}

	async minimumSwapAmount(poolPriceBsc, poolPriceEth, sumFees){

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
			var minimumSwapAmount = -( sumFees )/(priceCheapBLXM  + standardDeviation  - priceExpensiveBLXM); 

			logger.info("Minimum swap amount: " + minimumSwapAmount);

			return minimumSwapAmount;  
		} else {
			return -1;
		}
	}
}

module.exports = EvaluationService;