const AdjustmentValueService = require("./AdjustmentValueService");
const DataBaseService = require("./DataBaseService");
const EvaluationService = require("./EvaluationService");
const logger = require("../logger/logger");
const constants = require("../constants");

const Contracts = require("../contracts/Contracts");
const WalletContainer = require("../wallet/WalletContainer");

class ArbitrageService{

	constructor(){
		this._databaseService = DataBaseService;
		this._evaluationService = new EvaluationService(this._databaseService);

		this._ethContracts = new Contracts("ETH", WalletContainer.ArbitrageWalletETH);
		this._bscContracts = new Contracts("BSC", WalletContainer.ArbitrageWalletBSC);


		this.basicBsc = 150;
		this.stableBsc = 200;
        
		this.basicEth = 200;
		this.stableEth = 350;

		this.poolPriceBsc = 0;
		this.poolPriceEth = 0;
	}

	startArbitrage (){

		this.poolPriceBsc = this.stableBsc/this.basicBsc;
		this.poolPriceEth = this.stableEth/this.basicEth;

		if(this.poolPriceEth > this.poolPriceBsc){
			this.calculateSwapEth();
		}
		else {   
			this.calculateSwapBsc();  
		}      
	}

	async calculateSwapEth(){

		let basicCheap = this.basicBsc;
		let stableCheap = this.stableBsc;
		let basicExpensive = this.basicEth;
		let stableExpensive = this.stableEth;
		let constantCheap = this.stableBsc * this.basicBsc;
		let constantExpensive = this.stableEth * this.basicEth;     
		let adjustmentValueStable = this.getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive);
    
		let stableCheapNew = stableCheap + adjustmentValueStable;
		let basicCheapNew = constantCheap / stableCheapNew;

		let adjustmentValueBasic = basicCheap - basicCheapNew;
    
		let basicExpensiveNew = basicExpensive + basicCheap - basicCheapNew;
		let stableExpensiveNew = constantExpensive / basicExpensiveNew;
    
		let profit = stableExpensive - stableExpensiveNew - adjustmentValueStable;

		let swapStableTx = this._ethContracts.arbitrageContract.swapBasicToStable(adjustmentValueStable);
		let swapBasicTx = this._bscContracts.arbitrageContract.swapStableToBasic(adjustmentValueBasic);

		await swapStableTx.wait();
		await swapBasicTx.wait();

		console.log("poolPriceEth: " + this.poolPriceEth);
		console.log("poolPriceBsc: " + this.poolPriceBsc);
    
		console.log("AdjustmentValue: " + adjustmentValueStable);
		console.log("profit (only USDC profit): " + profit);
    
		console.log("stableBsc: " + this.stableBsc + " -> " + "stableBscNew: " + stableCheapNew);
		console.log("basicBsc: " + this.basicBsc + " -> " + "basicBscNew: " + basicCheapNew);
		console.log("stableEth: " + this.stableEth + " -> " + "stableEthNew: " + stableExpensiveNew);
		console.log("basicEth: " + this.basicEth + " -> " + "basicEthNew: " + basicExpensiveNew);
	}

	async calculateSwapBsc(){

		let basicCheap = this.basicEth;
		let stableCheap = this.stableEth;
		let basicExpensive = this.basicBsc;
		let stableExpensive = this.stableBsc;
		let constantCheap = this.stableEth * this.basicEth;
		let constantExpensive = this.stableBsc * this.basicBsc; 
          
		let adjustmentValueStable = this.getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive);
    
		let stableCheapNew = stableCheap + adjustmentValueStable;
		let basicCheapNew = constantCheap / stableCheapNew;

		let adjustmentValueBasic = basicCheap - basicCheapNew;
    
		let basicExpensiveNew = basicExpensive + adjustmentValueBasic;
		let stableExpensiveNew = constantExpensive / basicExpensiveNew;
    
		let profit = stableExpensive - stableExpensiveNew - adjustmentValueStable;

		let swapStableTx = this._ethContracts.arbitrageContract.swapStableToBasic(adjustmentValueStable);
		let swapBasicTx = this._bscContracts.arbitrageContract.swapBasicToStable(adjustmentValueBasic);

		await swapStableTx.wait();
		await swapBasicTx.wait();

		console.log("poolPriceEth: " + this.poolPriceEth);
		console.log("poolPriceBsc: " + this.poolPriceBsc);
    
		console.log("AdjustmentValue: " + adjustmentValueStable);
		console.log("profit: " + profit);
    
		console.log("stableBsc: " + this.stableBsc + " -> " + "stableBscNew: " + stableCheapNew);
		console.log("basicBsc: " + this.basicBsc + " -> " + "basicBscNew: " + basicCheapNew);
		console.log("stableEth: " + this.stableEth + " -> " + "stableEthNew: " + stableExpensiveNew);
		console.log("basicEth: " + this.basicEth + " -> " + "basicEthNew: " + basicExpensiveNew);
	}

    
	getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive){

		let adjustmentValue = (Math.sqrt(Math.pow(basicCheap, 2) * constantCheap * constantExpensive + 2 * basicCheap * basicExpensive * constantCheap * constantExpensive + 
        Math.pow(basicExpensive, 2) * constantCheap * constantExpensive) + 
        Math.pow(basicCheap, 2) * (-stableCheap) - 2 * basicCheap * basicExpensive * stableCheap + basicCheap * constantCheap - Math.pow(basicExpensive, 2) * 
        stableCheap + basicExpensive * constantCheap) / (Math.pow(basicCheap,2) + 2 *basicCheap * basicExpensive + Math.pow(basicExpensive, 2));
    
		return adjustmentValue;
	}

}

let arbitrage = new ArbitrageService();
arbitrage.startArbitrage();
