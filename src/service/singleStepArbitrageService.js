const logger = require("../logger/logger");
const ArbitrageService = require("../service/arbitrageServiceV2");

class SingleStepArbitrageService{

    constructor(){ 
        this.poolPriceEth;
        this.poolPriceBsc;

        this.adjustmentValueStable;
        this.adjustmentValueBasic;

        this.tokenArrayBsc;
        this.tokenArrayEth;

        this.stepStatus = 1;
    }

    resetSingleStepArbitrage() {
        logger.info("Stopping single step arbitrage ...");
        logger.info("Resetting to step 1 ...");

        this.stepStatus = 1;
    }

    async startSingleStepArbitrage(status) {
        this.stepStatus = status;

        await ArbitrageService.init();

        try {
            await ArbitrageService.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

            if(!ArbitrageService.poolPriceBsc.eq(ArbitrageService.poolPriceEth)) {

                switch(status){
                    case 1:                     
                        logger.info("Starting AbitrageService");
                        logger.info("Next step: collecting prices...");

                        break;
                    case 2: 
                        await ArbitrageService.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs
                        await ArbitrageService.getReserves(); //overwrites this.tokenArrayBsc and this.tokenArrayEth with the current reserves from the LPs
                        
                        logger.info("Price difference found");
                        logger.info("ETH network: Current price = " + ArbitrageService.poolPriceEth + " USD/BLXM");
                        logger.info("BSC network: Current price = " + ArbitrageService.poolPriceBsc + " USD/BLXM");
                        
                        logger.info("Next step: calculating aribtrage ...");
                        break;
                    case 3: 
                        logger.info("Calculating arbitrage ...");
                        await this.calculateArbitrage();
                        logger.info("Adjustment Value stable: " + ArbitrageService.adjustmentValueStable); 
                        logger.info("Adjustment Value basic: " + ArbitrageService.adjustmentValueBasic);    
                        
                        logger.info("Next step: Executing swaps ...");
                        break;
                    case 4: 
                        logger.info("Executing swaps");    
                        await this.executeSwap();        
                        
                        break;
                    }			
                }   

            else {
                logger.info("No arbitrage opportunity found.");
            }
        }
        catch(error) {
			logger.error("Single step arbitrage service failed. Error: " +  error);
			logger.error("Service stopped ...");
            logger.info("Resetting to step 1 ...");

            this.stepStatus = 1;
		}
    }

    async calculateArbitrage(){
        if(ArbitrageService.poolPriceEth.gt(ArbitrageService.poolPriceBsc)){
            await ArbitrageService.calculateSwapEth(ArbitrageService.tokenArrayBsc[1], ArbitrageService.tokenArrayBsc[0], ArbitrageService.tokenArrayEth[1], ArbitrageService.tokenArrayEth[0]);
        }
        else {
            await ArbitrageService.calculateSwapBsc(ArbitrageService.tokenArrayEth[1], ArbitrageService.tokenArrayEth[0], ArbitrageService.tokenArrayBsc[1], ArbitrageService.tokenArrayBsc[0]);  
        }
    }

    async executeSwap(){
        if(ArbitrageService.poolPriceEth.gt(ArbitrageService.poolPriceBsc)){
            if(ArbitrageService.profitAfterSlippage.gt(0)) {
                await ArbitrageService.swapEth();
            }
            else {
                logger.info("ETH: Calculated profit after slippage: " + ArbitrageService.profitAfterSlippage + " is negative.");
                logger.info("Skipping current arbitrage cycle...");
            }
        }
        else {
            if(ArbitrageService.profitAfterSlippage.gt(0)) {
                await ArbitrageService.swapBsc();
            }
            else {
                logger.info("BSC: Calculated profit after slippage: " + ArbitrageService.profitAfterSlippage + " is negative.");
                logger.info("Skipping current arbitrage cycle...");
            }
        }
    }
}

module.exports = new SingleStepArbitrageService();