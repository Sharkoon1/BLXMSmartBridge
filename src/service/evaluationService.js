const logger = require("../logger/logger");
const DataService = require("./DataService");

class EvaluationService {

	constructor() {
		this._dataService = DataService;
	}

	async minimumSwapAmount(poolPriceBsc, poolPriceEth, sumFees, currentNetwork){

		let priceExpensiveBLXM;
		let priceCheapBLXM;
    
		if(poolPriceBsc.gt(poolPriceEth)) {
			priceExpensiveBLXM = poolPriceBsc;
			priceCheapBLXM = poolPriceEth;
		} else {
			priceExpensiveBLXM = poolPriceEth; 
			priceCheapBLXM = poolPriceBsc;
		}
        
		let standardDeviation = await this._dataService.getStandardDeviation(currentNetwork);
    
		if (priceCheapBLXM.plus(standardDeviation).lt(priceExpensiveBLXM)) {
			var minimumSwapAmount = (( sumFees ).dividedBy((priceCheapBLXM.plus(standardDeviation).minus(priceExpensiveBLXM)))).multipliedBy(-1); 

			logger.info("Evaluation service calculated minimum swap amount: " + minimumSwapAmount);

			return minimumSwapAmount;  
		} else {
			return -1;
		}
	}
}

module.exports = new EvaluationService();