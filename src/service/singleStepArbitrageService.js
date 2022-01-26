const { ethers } = require("ethers");
const logger = require("../logger/logger");
const constants = require("../constants");
const Contracts = require("../contracts/Contracts");
const OracleContract = require("../contracts/OracleContract");
const ArbitrageService = require("../service/arbitrageServiceV2")

class singleArbitrageService{

    constructor(){

		this._ethContracts = new Contracts("ETH");
		this._bscContracts = new Contracts("BSC");

		this.UniswapOracle = new OracleContract("ETH", constants.BLXM_TOKEN_ADDRESS_ETH, constants.USD_TOKEN_ADRESS_ETH);
		this.PancakeOracle = new OracleContract("BSC", constants.BLXM_TOKEN_ADDRESS_BSC, constants.USD_TOKEN_ADRESS_BSC);
	
		this.poolPriceEth;
		this.poolPriceBsc;

		this.adjustmentValueStable;
        this.adjustmentValueBasic;

        this.tokenArrayBsc;
        this.tokenArrayEth;

    }

    async startSingleStepArbitrage() {

        await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

        if(!this.poolPriceBsc.eq(this.poolPriceEth)){

            let httpReturn = "1"
            switch(httpReturn){

                case "1": 

                    await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs
                    await this.getReserves(); //overwrites this.tokenArrayBsc and this.tokenArrayEth with the current reserves from the LPs
                    
                    logger.info("Starting AbitrageService");
                    
                        break;

                case "2": 
                
                    logger.info("Price difference found")
                    logger.info("ETH network: Current price = " + this.poolPriceEth + " USD/BLXM")
                    logger.info("BSC network: Current price = " + this.poolPriceBsc + " USD/BLXM");

                        break;

                case "3": 

                    logger.info("Calculating arbitrage");
                    this.calculateArbitrage();
                    logger.info("Adjustment Value stable: " + ArbitrageService.adjustmentValueStable); 
                    logger.info("Adjustment Value basic: " + ArbitrageService.adjustmentValueBasic);    

                        break;

                case "4": 

                    logger.info("Executing swap");    
                    executeSwap();
        
                        break;
                }			
            }   

        else{

            logger.info("no Arbitrage opportunity found.")
        }
    }

    async getPoolPrices(){

		this.poolPriceBsc = await this.PancakeOracle.getPrice();
		//this.poolPriceEth = await this.UniswapOracle.getPrice();
	}

    async getReserves(){

        this.tokenArrayBsc = await this.PancakeOracle.getReserves(); //tokenArrayBsc[0] = stableBsc, tokenArrayBsc[1] = basicBsc
        this.tokenArrayEth = await this.UniswapOracle.getReserves(); //tokenArrayEth[0] = stableEth, tokenArrayEth[1] = basicEth
    }

    async calculateArbitrage(){

        if(this.poolPriceEth.gt(this.poolPriceBsc)){

            ArbitrageService.calculateSwapEth(this.tokenArrayBsc[1], this.tokenArrayBsc[0], this.tokenArrayEth[1], this.tokenArrayEth[0]);
        }

        else {
        
            ArbitrageServiceV2.calculateSwapBsc(this.tokenArrayEth[1], this.tokenArrayEth[0], this.tokenArrayBsc[1], this.tokenArrayBsc[0]);  

        }
    }

    async executeSwap(){

        if(this.poolPriceEth.gt(this.poolPriceBsc)){

            ArbitrageService.swapEth();
        }

        else {
        
            ArbitrageService.swapBsc();
        }
    }
}

let singleArbitrage = new singleArbitrageService();
//singleArbitrage.startSingleStepArbitrage();

new singleArbitrageService().getPoolPrices();



