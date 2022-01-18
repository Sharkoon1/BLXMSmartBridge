require("dotenv").config();
const { ethers } = require("ethers");
const DataBaseService = require("./DataBaseService");
const EvaluationService = require("./EvaluationService");
const logger = require("../logger/logger");
const constants = require("../constants");
const Contracts = require("../contracts/Contracts");
const OracleContract = require("../contracts/OracleContract");


class ArbitrageService{

	constructor(){
		this._databaseService = DataBaseService;
		this._evaluationService = new EvaluationService(this._databaseService);

		this._ethContracts = new Contracts("ETH");
		this._bscContracts = new Contracts("BSC");

		this.UniswapOracle = new OracleContract("ETH", constants.BLXM_TOKEN_ADDRESS_ETH, constants.USD_TOKEN_ADRESS_ETH);
		this.PancakeOracle = new OracleContract("BSC", constants.BLXM_TOKEN_ADDRESS_BSC, constants.USD_TOKEN_ADRESS_BSC);
	
		this.poolPriceEth = null;
		this.poolPriceBsc = null;
	}

	async startArbitrage (){

		logger.info("Start AbitrageService ...");

		this.poolPriceBsc = await this.PancakeOracle.getPrice();
		this.poolPriceEth = await this.UniswapOracle.getPrice();

		while (!this.poolPriceBsc.eq(this.poolPriceEth)) {
			let tokenArrayBsc = await this.PancakeOracle.getReserves(); //tokenArrayBsc[0] = stableBsc, tokenArrayBsc[1] = basicBsc
			let tokenArrayEth = await this.UniswapOracle.getReserves(); //tokenArrayEth[0] = stableEth, tokenArrayEth[1] = basicEth

			logger.info("Price difference  found ");
			logger.info("ETH network: Current price BLXM " + this.poolPriceEth + " USD");
			logger.info("BSC network: Current price BLXM " + this.poolPriceBsc + " USD");

			if(this.poolPriceEth.gt(this.poolPriceBsc)){

				this.calculateSwapEth(tokenArrayBsc[1], tokenArrayBsc[0], tokenArrayEth[1], tokenArrayEth[0]);
			
			}

			else {
			
				this.calculateSwapBsc(tokenArrayEth[1], tokenArrayEth[0], tokenArrayBsc[1], tokenArrayBsc[0]);  
			
			}

			this.poolPriceBsc = await this.PancakeOracle.getPrice();
			this.poolPriceEth = await this.UniswapOracle.getPrice();

			break;
		}
	}

	async startSingleArbitrageCycle() {
		//TODO
	}

	async calculateSwapEth(basicCheap, stableCheap, basicExpensive, stableExpensive){ // When ETH is more expensive

		let constantCheap = basicCheap.mul(stableCheap);
		let constantExpensive = basicExpensive.mul(stableExpensive);   

		let adjustmentValueStable = this.getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive);
    
		let stableCheapNew = stableCheap + adjustmentValueStable;
		let basicCheapNew = constantCheap / stableCheapNew;

		let adjustmentValueBasic = basicCheap - basicCheapNew; 
    
		let basicExpensiveNew = basicExpensive + basicCheap - basicCheapNew;
		let stableExpensiveNew = constantExpensive / basicExpensiveNew;
    
		let profitUsd = stableExpensive - stableExpensiveNew - adjustmentValueStable;

		let gasLimitBsc = this._bscContracts.arbitrageContract.swapStableToBasicGasLimit(adjustmentValueStable);
		let gasLimitEth = this._ethContracts.arbitrageContract.swapBasicToStableGasLimit(adjustmentValueBasic);
		
		let transactionFees = (await this._bscContracts.provider.getFeeData()).maxFeePerGas.mul(gasLimitBsc) + 
		(await this._ethContracts.provider.getFeeData()).maxFeePerGas.mul(gasLimitEth);
		
		this._evaluationService.minimumSwapAmount(this.poolPriceBsc, this.poolPriceEth, transactionFees);
		
		let swapStableToBasicTx = this._bscContracts.arbitrageContract.swapStableToBasic(adjustmentValueStable);
		let swapBasicToStableTx = this._ethContracts.arbitrageContract.swapBasicToStable(adjustmentValueBasic);
		
		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

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

		let constantCheap = this.stableEth * this.basicEth;
		let constantExpensive = this.stableBsc * this.basicBsc; 
          
		let adjustmentValueStable = this.getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive);
    
		let stableCheapNew = stableCheap + adjustmentValueStable;
		let basicCheapNew = constantCheap / stableCheapNew;

		let adjustmentValueBasic = basicCheap - basicCheapNew;
    
		let basicExpensiveNew = basicExpensive + adjustmentValueBasic;
		let stableExpensiveNew = constantExpensive / basicExpensiveNew;
    
		let profitUsd = stableExpensive - stableExpensiveNew - adjustmentValueStable;
	
		let gasLimitEth = this._ethContracts.arbitrageContract.swapStableToBasicGasLimit(adjustmentValueStable);
		let gasLimitBsc = this._bscContracts.arbitrageContract.swapBasicToStableGasLimit(adjustmentValueBasic);

		let transactionFees = (await this._bscContracts.provider.getFeeData()).maxFeePerGas.mul(gasLimitBsc) + 
							  (await this._ethContracts.provider.getFeeData()).maxFeePerGas.mul(gasLimitEth);

		this._evaluationService.minimumSwapAmount(this.poolPriceBsc, this.poolPriceEth, transactionFees);

		let swapStableToBasicTx = this._ethContracts.arbitrageContract.swapStableToBasic(adjustmentValueStable);
		let swapBasicToStableTx = this._bscContracts.arbitrageContract.swapBasicToStable(adjustmentValueBasic);

		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

		console.log("poolPriceEth: " + this.poolPriceEth);
		console.log("poolPriceBsc: " + this.poolPriceBsc);
    
		console.log("AdjustmentValue: " + adjustmentValueStable);
		console.log("profitUsd: " + profitUsd);
    
		console.log("stableBsc: " + this.stableBsc + " -> " + "stableBscNew: " + stableCheapNew);
		console.log("basicBsc: " + this.basicBsc + " -> " + "basicBscNew: " + basicCheapNew);
		console.log("stableEth: " + this.stableEth + " -> " + "stableEthNew: " + stableExpensiveNew);
		console.log("basicEth: " + this.basicEth + " -> " + "basicEthNew: " + basicExpensiveNew);
	}

    
	getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive){

		let adjustmentValue = (Math.sqrt(Math.pow(basicCheap, 2) * constantCheap * constantExpensive + 2 * basicCheap * basicExpensive * constantCheap * constantExpensive + 
        Math.pow(basicExpensive, 2) * constantCheap * constantExpensive) + 
        Math.pow(basicCheap, 2) * (-stableCheap) - 2 * basicCheap * basicExpensive * stableCheap + basicCheap * constantCheap - Math.pow(basicExpensive, 2) * 
        stableCheap + basicExpensive * constantCheap) / (Math.pow(basicCheap,2) + 2 * basicCheap * basicExpensive + Math.pow(basicExpensive, 2));
    
		return adjustmentValue;
	}
}

let arbitrage = new ArbitrageService();
arbitrage.startArbitrage();
