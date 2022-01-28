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
    
		var minimumSwapAmount = (( sumFees ).dividedBy((priceCheapBLXM.plus(standardDeviation).minus(priceExpensiveBLXM))));

		logger.info("Maximum sum of transaction fees: " + sumFees);
		logger.info("Evaluation service calculated minimum swap amount: " + minimumSwapAmount);

		return minimumSwapAmount;  
	}
}

module.exports = new EvaluationService();