const logger = require("../logger/logger");
const ArbitrageService = require("../service/arbitrageServiceV2");
const Contracts = require("../contracts/contracts");

class SingleStepArbitrageService{

    constructor(){
        this._ethContracts = new Contracts("ETH");
        this._bscContracts = new Contracts("BSC");
    
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

        try {
            await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

            if(!this.poolPriceBsc.eq(this.poolPriceEth)) {

                switch(status){
                    case 1:                     
                        logger.info("Starting AbitrageService");
                        logger.info("Next step: collecting prices...");

                        break;
                    case 2: 
                        await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs
                        await this.getReserves(); //overwrites this.tokenArrayBsc and this.tokenArrayEth with the current reserves from the LPs
                        
                        logger.info("Price difference found");
                        logger.info("ETH network: Current price = " + this.poolPriceEth + " USD/BLXM");
                        logger.info("BSC network: Current price = " + this.poolPriceBsc + " USD/BLXM");
                        
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

    async getPoolPrices(){
		this.poolPriceBsc = await this._bscContracts.oracleContract.getPrice();
		this.poolPriceEth = await this._ethContracts.oracleContract.getPrice();

        ArbitrageService.poolPriceBsc = this.poolPriceBsc;
        ArbitrageService.poolPriceEth = this.poolPriceEth;
	}

    async getReserves(){
        this.tokenArrayBsc = await this._bscContracts.oracleContract.getReserves(); //tokenArrayBsc[0] = stableBsc, tokenArrayBsc[1] = basicBsc
        this.tokenArrayEth = await this._ethContracts.oracleContract.getReserves(); //tokenArrayEth[0] = stableEth, tokenArrayEth[1] = basicEth
    }

    async calculateArbitrage(){
        if(this.poolPriceEth.gt(this.poolPriceBsc)){
            await ArbitrageService.calculateSwapEth(this.tokenArrayBsc[1], this.tokenArrayBsc[0], this.tokenArrayEth[1], this.tokenArrayEth[0]);
        }
        else {
            await ArbitrageService.calculateSwapBsc(this.tokenArrayEth[1], this.tokenArrayEth[0], this.tokenArrayBsc[1], this.tokenArrayBsc[0]);  
        }
    }

    async executeSwap(){
        if(this.poolPriceEth.gt(this.poolPriceBsc)){
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