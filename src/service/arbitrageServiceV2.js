require("dotenv").config();
const { ethers } = require("ethers");
const DataBaseService = require("./DataBaseService");
//const EvaluationService = require("./EvaluationService");
const logger = require("../logger/logger");
const constants = require("../constants");
const Contracts = require("../contracts/Contracts");
const OracleContract = require("../contracts/OracleContract");
const BigNumber  = require("bignumber.js");



class ArbitrageService{

	constructor(){
		this._databaseService = DataBaseService;
		//this._evaluationService = new EvaluationService(this._databaseService);

		this._ethContracts = new Contracts("ETH");
		this._bscContracts = new Contracts("BSC");

		this.UniswapOracle = new OracleContract("ETH", constants.BLXM_TOKEN_ADDRESS_ETH, constants.USD_TOKEN_ADRESS_ETH);
		this.PancakeOracle = new OracleContract("BSC", constants.BLXM_TOKEN_ADDRESS_BSC, constants.USD_TOKEN_ADRESS_BSC);
	
		this.poolPriceEth;
		this.poolPriceBsc;
	}

	async startArbitrage (){

		logger.info("Start AbitrageService ...");

		await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

		while (!this.poolPriceBsc.eq(this.poolPriceEth)) {
			let tokenArrayBsc = await this.PancakeOracle.getReserves(); //tokenArrayBsc[0] = stableBsc, tokenArrayBsc[1] = basicBsc
			let tokenArrayEth = await this.UniswapOracle.getReserves(); //tokenArrayEth[0] = stableEth, tokenArrayEth[1] = basicEth

			logger.info("Price difference found");
			logger.info("ETH network: Current price = " + this.poolPriceEth + " USD/BLXM");
			logger.info("BSC network: Current price = " + this.poolPriceBsc + " USD/BLXM");

			if(this.poolPriceEth.gt(this.poolPriceBsc)){

				this.calculateSwapEth(tokenArrayBsc[1], tokenArrayBsc[0], tokenArrayEth[1], tokenArrayEth[0]);
			
			}

			else {
			
				this.calculateSwapBsc(tokenArrayEth[1], tokenArrayEth[0], tokenArrayBsc[1], tokenArrayBsc[0]);  
			
			}

			await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

			break;
		}
	}

	async startSingleArbitrageCycle() {
		this.singleArbitrageSwitch = true;

		this.startArbitrage ();
	}

	async calculateSwapEth(basicCheap, stableCheap, basicExpensive, stableExpensive){ // When ETH is more expensive

		let constantCheap = stableCheap.multipliedBy(basicCheap);
		let constantExpensive = stableExpensive.multipliedBy(basicExpensive);   

		let adjustmentValueStable = this.getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive);
    
		let stableCheapNew = stableCheap.plus(adjustmentValueStable);
		let basicCheapNew = constantCheap.div(stableCheapNew);

		let adjustmentValueBasic = basicCheap.minus(basicCheapNew); 
    
		let basicExpensiveNew = basicExpensive.plus(basicCheap).minus(basicCheapNew);
		let stableExpensiveNew = constantExpensive.div(basicExpensiveNew);
    
		let profitUsd = stableExpensive.minus(stableExpensiveNew).minus(adjustmentValueStable);

		/*	
		let gasLimitBsc = this._bscContracts.arbitrageContract.swapStableToBasicGasLimit(adjustmentValueStable);
		let gasLimitEth = this._ethContracts.arbitrageContract.swapBasicToStableGasLimit(adjustmentValueBasic);
		let transactionFees = (await this._bscContracts.provider.getFeeData()).maxFeePerGas.mul(gasLimitBsc) + 
		(await this._ethContracts.provider.getFeeData()).maxFeePerGas.mul(gasLimitEth);
		
		this._evaluationService.minimumSwapAmount(this.poolPriceBsc, this.poolPriceEth, transactionFees);
	*/	
		let swapStableToBasicTx = await this._bscContracts.arbitrageContract.swapStableToBasic(this.toEthersBigNumber(adjustmentValueStable));
		let swapBasicToStableTx = await this._ethContracts.arbitrageContract.swapBasicToStable(this.toEthersBigNumber(adjustmentValueBasic));
		
		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

		await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

		console.log("poolPriceEth: " + this.poolPriceEth);
		console.log("poolPriceBsc: " + this.poolPriceBsc);
    
		console.log("AdjustmentValue: " + adjustmentValueStable);
		console.log("profitUsd: " + profitUsd);
    
		console.log("stableBsc: " + this.stableBsc + " -> " + "stableBscNew: " + stableCheapNew);
		console.log("basicBsc: " + this.basicBsc + " -> " + "basicBscNew: " + basicCheapNew);
		console.log("stableEth: " + this.stableEth + " -> " + "stableEthNew: " + stableExpensiveNew);
		console.log("basicEth: " + this.basicEth + " -> " + "basicEthNew: " + basicExpensiveNew);
	}

	async calculateSwapBsc(basicCheap, stableCheap, basicExpensive, stableExpensive){ // When BSC is more expensive

		let constantCheap = stableCheap.multipliedBy(basicCheap);
		let constantExpensive = stableExpensive.multipliedBy(basicExpensive); 
          
		let adjustmentValueStable = this.getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive);

		let stableCheapNew = stableCheap.plus(adjustmentValueStable);
		let basicCheapNew = constantCheap.div(stableCheapNew);

		let adjustmentValueBasic = basicCheap.minus(basicCheapNew);
    
		let basicExpensiveNew = basicExpensive.plus(adjustmentValueBasic);
		let stableExpensiveNew = constantExpensive.div(basicExpensiveNew);
    
		let profitUsd = stableExpensive.minus(stableExpensiveNew).minus(adjustmentValueStable);
	
		/*
		let gasLimitEth = this._ethContracts.arbitrageContract.swapStableToBasicGasLimit(adjustmentValueStable);
		let gasLimitBsc = this._bscContracts.arbitrageContract.swapBasicToStableGasLimit(adjustmentValueBasic);
		let transactionFees = (await this._bscContracts.provider.getFeeData()).maxFeePerGas.mul(gasLimitBsc) + 
							  (await this._ethContracts.provider.getFeeData()).maxFeePerGas.mul(gasLimitEth);

		this._evaluationService.minimumSwapAmount(this.poolPriceBsc, this.poolPriceEth, transactionFees);
*/
		let swapStableToBasicTx = await this._ethContracts.arbitrageContract.swapStableToBasic(this.toEthersBigNumber(adjustmentValueStable));
		let swapBasicToStableTx = await this._bscContracts.arbitrageContract.swapBasicToStable(this.toEthersBigNumber(adjustmentValueBasic));

		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

		await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

		console.log("poolPriceEth: " + this.poolPriceEth);
		console.log("poolPriceBsc: " + this.poolPriceBsc);
    
		console.log("AdjustmentValue: " + adjustmentValueStable);
		console.log("profitUsd: " + profitUsd);
    
		console.log("stableBsc: " + this.stableBsc + " -> " + "stableBscNew: " + stableCheapNew);
		console.log("basicBsc: " + this.basicBsc + " -> " + "basicBscNew: " + basicCheapNew);
		console.log("stableEth: " + this.stableEth + " -> " + "stableEthNew: " + stableExpensiveNew);
		console.log("basicEth: " + this.basicEth + " -> " + "basicEthNew: " + basicExpensiveNew);
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
}

let arbitrage = new ArbitrageService();
arbitrage.startArbitrage();
