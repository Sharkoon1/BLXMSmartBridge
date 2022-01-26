const { ethers } = require("ethers");
const logger = require("../logger/logger");
const DataService = require("./DataService");

class EvaluationService {

	constructor() {
		this._dataService = DataService;
	}

	async minimumSwapAmount(poolPriceBsc, poolPriceEth, sumFees, currentNetwork){

		let priceExpensiveBLXM;
		let priceCheapBLXM;
    
		if(poolPriceBsc > poolPriceEth){
			priceExpensiveBLXM = poolPriceBsc;
			priceCheapBLXM = poolPriceEth;
		} else {
			priceExpensiveBLXM = poolPriceEth;
			priceCheapBLXM = poolPriceBsc;
		}
        
		let standardDeviation = this._dataService.getStandardDeviation(currentNetwork);
    
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