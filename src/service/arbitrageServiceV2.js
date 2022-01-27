require("dotenv").config();
const { ethers } = require("ethers");
const DataBaseService = require("./DataBaseService");
const EvaluationService = require("./EvaluationService");
const logger = require("../logger/logger");
const constants = require("../constants");
const Contracts = require("../contracts/Contracts");
const OracleContract = require("../contracts/OracleContract");
const BigNumber  = require("bignumber.js");
const app = require("../app");


class ArbitrageService {
	constructor(){
		this._databaseService = DataBaseService;
		this._evaluationService = EvaluationService;

		this._ethContracts = new Contracts("ETH");
		this._bscContracts = new Contracts("BSC");

		this.UniswapOracle = new OracleContract("ETH", constants.BLXM_TOKEN_ADDRESS_ETH, constants.USD_TOKEN_ADDRESS_ETH);
		this.PancakeOracle = new OracleContract("BSC", constants.BLXM_TOKEN_ADDRESS_BSC, constants.USD_TOKEN_ADDRESS_BSC);
	
		this.poolPriceEth;
		this.poolPriceBsc;

		this.adjustmentValueStable;
		this.adjustmentValueBasic;
		this.minimumSwapAmount;

		this.stopCycle = false;
		this.isRunning = false;
	}

	async startArbitrage (){
		this.stopCycle = false;
		this.isRunning = true;

		try {
			logger.info("Starting the abitrage service ..."); 
 
			await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

			while (!this.poolPriceBsc.eq(this.poolPriceEth)) {
				let tokenArrayBsc = await this.PancakeOracle.getReserves(); //tokenArrayBsc[0] = stableBsc, tokenArrayBsc[1] = basicBsc
				let tokenArrayEth = await this.UniswapOracle.getReserves(); //tokenArrayEth[0] = stableEth, tokenArrayEth[1] = basicEth
	
				logger.info("Price difference found");
				logger.info("ETH network: Current price = " + this.poolPriceEth + " USD/BLXM");
				logger.info("BSC network: Current price = " + this.poolPriceBsc + " USD/BLXM");
	
				if(this.poolPriceEth.gt(this.poolPriceBsc)){
	
					await this.calculateSwapEth(tokenArrayBsc[1], tokenArrayBsc[0], tokenArrayEth[1], tokenArrayEth[0]);
	
					if(this.minimumSwapAmount < this.adjustmentValueStable) {
						await this.swapEth();
					}
	
					else {
						logger.info("ETH: Minimum swap amount: " + this.minimumSwapAmount + "is bigger than the calculated adjustment value: " + this.adjustmentValueStable);
						logger.info("Skipping current arbitrage cycle...");
					}
					
				}
	
				else {
					await this.calculateSwapBsc(tokenArrayEth[1], tokenArrayEth[0], tokenArrayBsc[1], tokenArrayBsc[0]);  
	
					if(this.minimumSwapAmount < this.adjustmentValueStable) {
						await this.swapBsc();
					}
					else {
						logger.info("BSC: Minimum swap amount: " + this.minimumSwapAmount + "is bigger than the calculated adjustment value: " + this.adjustmentValueStable);
						logger.info("Skipping current arbitrage cycle...");
					}
				
				}
	
				if(this.stopCycle) {
					logger.info("The arbitrage service has been stopped and the last cycle has been completed.");
	
					this.isRunning = false;
					app.logEvent.emit("cycleCompleted", true);
					break;
				}
			}
	
		
			this.isRunning = false;
		}	
		catch(error) {
			logger.error("Arbitrage service failed. Error: " +  error);
			logger.error("Service stopped ...");

			app.logEvent.emit("cycleCompleted", true);
			this.isRunning = false;
		}
	}

	async calculateSwapEth(basicCheap, stableCheap, basicExpensive, stableExpensive){ // When ETH is more expensive

		let constantCheap = stableCheap.multipliedBy(basicCheap);
		let constantExpensive = stableExpensive.multipliedBy(basicExpensive);   

		this.adjustmentValueStable = this.getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive);
    
		let stableCheapNew = stableCheap.plus(this.adjustmentValueStable);
		let basicCheapNew = constantCheap.div(stableCheapNew);

		this.adjustmentValueBasic = basicCheap.minus(basicCheapNew); 
    
		let basicExpensiveNew = basicExpensive.plus(basicCheap).minus(basicCheapNew);
		let stableExpensiveNew = constantExpensive.div(basicExpensiveNew);
    
		let profitUsd = stableExpensive.minus(stableExpensiveNew).minus(this.adjustmentValueStable);

		let gasLimitBsc = await this._bscContracts.arbitrageContract.swapStableToBasicGasLimit(this.toEthersBigNumber(this.adjustmentValueStable));
		let gasLimitEth = await this._ethContracts.arbitrageContract.swapBasicToStableGasLimit(this.toEthersBigNumber(this.adjustmentValueBasic));

		let transactionFees = (await this._bscContracts.provider.getFeeData()).maxFeePerGas.mul(gasLimitBsc)
							  .add((await this._ethContracts.provider.getFeeData()).maxFeePerGas.mul(gasLimitEth));
		 
		this.minimumSwapAmount = await this._evaluationService.minimumSwapAmount(this.poolPriceBsc, this.poolPriceEth, this.fromEthersToBigNumber(transactionFees), "BSC");
	}		

	async swapEth(){

		let swapStableToBasicTx = await this._bscContracts.arbitrageContract.swapStableToBasic(this.toEthersBigNumber(this.adjustmentValueStable));
		let swapBasicToStableTx = await this._ethContracts.arbitrageContract.swapBasicToStable(this.toEthersBigNumber(this.adjustmentValueBasic));
		
		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

		await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

		console.log("poolPriceEth: " + this.poolPriceEth);
		console.log("poolPriceBsc: " + this.poolPriceBsc);
     
		console.log("AdjustmentValue: " + this.adjustmentValueStable);
	}

	async calculateSwapBsc(basicCheap, stableCheap, basicExpensive, stableExpensive){ // When BSC is more expensive

		let constantCheap = stableCheap.multipliedBy(basicCheap);
		let constantExpensive = stableExpensive.multipliedBy(basicExpensive); 
          
		this.adjustmentValueStable = this.getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive);

		let stableCheapNew = stableCheap.plus(this.adjustmentValueStable);
		let basicCheapNew = constantCheap.div(stableCheapNew);

		let adjustmentValueBasic = basicCheap.minus(basicCheapNew);
    
		let basicExpensiveNew = basicExpensive.plus(adjustmentValueBasic);
		let stableExpensiveNew = constantExpensive.div(basicExpensiveNew);
    
		let profitUsd = stableExpensive.minus(stableExpensiveNew).minus(this.adjustmentValueStable);
	
		let gasLimitEth = await this._ethContracts.arbitrageContract.swapStableToBasicGasLimit(this.toEthersBigNumber(this.adjustmentValueStable));
		let gasLimitBsc = await this._bscContracts.arbitrageContract.swapBasicToStableGasLimit(this.toEthersBigNumber(this.adjustmentValueBasic));

		let transactionFees = (await this._bscContracts.provider.getFeeData()).maxFeePerGas.mul(gasLimitBsc)
							  .add((await this._ethContracts.provider.getFeeData()).maxFeePerGas.mul(gasLimitEth));


		this.minimumSwapAmount = await this._evaluationService.minimumSwapAmount(this.poolPriceBsc, this.poolPriceEth, this.fromEthersToBigNumber(transactionFees), "ETH");
	}

	async swapBsc(){

		let swapStableToBasicTx = await this._ethContracts.arbitrageContract.swapStableToBasic(this.toEthersBigNumber(this.adjustmentValueStable));
		let swapBasicToStableTx = await this._bscContracts.arbitrageContract.swapBasicToStable(this.toEthersBigNumber(this.adjustmentValueBasic));

		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

		await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

		console.log("poolPriceEth: " + this.poolPriceEth);
		console.log("poolPriceBsc: " + this.poolPriceBsc);
    
		console.log("AdjustmentValue: " + this.adjustmentValueStable);
	}

    
	getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive){ //With BigNumber.js Operators and data types

		let term1 = basicCheap.exponentiatedBy(2).multipliedBy(constantCheap).multipliedBy(constantExpensive);
		let term2 = basicCheap.multipliedBy(2).multipliedBy(basicExpensive).multipliedBy(constantCheap).multipliedBy(constantExpensive);
		let term3 = basicExpensive.exponentiatedBy(2).multipliedBy(constantCheap).multipliedBy(constantExpensive);
		let term4 = basicCheap.exponentiatedBy(2).multipliedBy(stableCheap.multipliedBy(-1));
		let term5 = basicCheap.multipliedBy(2).multipliedBy(basicExpensive).multipliedBy(stableCheap);
		let term6 = basicCheap.multipliedBy(constantCheap);
		let term7 = basicExpensive.exponentiatedBy(2).multipliedBy(stableCheap);
		let term8 = basicExpensive.multipliedBy(constantCheap);
	
		let term9 = basicCheap.exponentiatedBy(2);
		let term10 = basicCheap.multipliedBy(2).multipliedBy(basicExpensive);
		let term11 = basicExpensive.exponentiatedBy(2);    
		
		let adjustmentValue = ((term1.plus(term2).plus(term3).squareRoot()).plus(term4).minus(term5).plus(term6).minus(term7).plus(term8)).dividedBy((term9.plus(term10.plus(term11))));

		return adjustmentValue;
	}

	async getPoolPrices(){
		this.poolPriceBsc = await this.PancakeOracle.getPrice();
		this.poolPriceEth = await this.UniswapOracle.getPrice();
	}

	toEthersBigNumber(value){
		let x = new BigNumber(10).pow(18);
		return ethers.BigNumber.from(value.multipliedBy(x).dp(0).toString());
	}

	fromEthersToBigNumber(value){
		return new BigNumber(ethers.utils.formatEther(value));
	}
}

module.exports = new ArbitrageService();