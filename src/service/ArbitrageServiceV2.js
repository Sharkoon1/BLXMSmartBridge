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


		this.blxmBsc = 150;
		this.usdcBsc = 200;
        
		this.blxmEth = 200;
		this.usdcEth = 350;

		this.poolPriceBsc = 0;
		this.poolPriceEth = 0;
	}

	startArbitrage (){

		this.poolPriceBsc = this.usdcBsc/this.blxmBsc;
		this.poolPriceEth = this.usdcEth/this.blxmEth;

		if(this.poolPriceEth > this.poolPriceBsc){

			this.calculateSwapEth();

		}
		else {
    
			this.calculateSwapBsc();
    
		}
        
	}

	calculateSwapEth(){

		let blxmCheap = this.blxmBsc;
		let usdCheap = this.usdcBsc;
		let blxmExpensive = this.blxmEth;
		let usdExpensive = this.usdcEth;
		let constantCheap = this.usdcBsc * this.blxmBsc;
		let constantExpensive = this.usdcEth * this.blxmEth;     
		let adjustmentValue = this.getAdjustmentValueUsd(blxmCheap, usdCheap, blxmExpensive, constantCheap, constantExpensive);
    
		let usdCheapNew = usdCheap + adjustmentValue;
		let blxmCheapNew = constantCheap / usdCheapNew;
    
		let blxmExpensiveNew = blxmExpensive + blxmCheap - blxmCheapNew;
		let usdExpensiveNew = constantExpensive / blxmExpensiveNew;
    
		let profit = usdExpensive - usdExpensiveNew - adjustmentValue;
    
		console.log("poolPriceEth: " + this.poolPriceEth);
		console.log("poolPriceBsc: " + this.poolPriceBsc);
    
		console.log("AdjustmentValue: " + adjustmentValue);
		console.log("profit (only USDC profit): " + profit);
    
		console.log("usdcBsc: " + this.usdcBsc + " -> " + "usdcBscNew: " + usdCheapNew);
		console.log("blxmBsc: " + this.blxmBsc + " -> " + "blxmBscNew: " + blxmCheapNew);
		console.log("usdcEth: " + this.usdcEth + " -> " + "usdcEthNew: " + usdExpensiveNew);
		console.log("blxmEth: " + this.blxmEth + " -> " + "blxmEthNew: " + blxmExpensiveNew);
	}

	calculateSwapBsc(){

		let blxmCheap = this.blxmEth;
		let usdCheap = this.usdcEth;
		let blxmExpensive = this.blxmBsc;
		let usdExpensive = this.usdcBsc;
		let constantCheap = this.usdcEth * this.blxmEth;
		let constantExpensive = this.usdcBsc * this.blxmBsc;   
		let adjustmentValue = this.getAdjustmentValueUsd(blxmCheap, usdCheap, blxmExpensive, constantCheap, constantExpensive);
    
		let usdCheapNew = usdCheap + adjustmentValue;
		let blxmCheapNew = constantCheap / usdCheapNew;
    
		let blxmExpensiveNew = blxmExpensive + blxmCheap - blxmCheapNew;
		let usdExpensiveNew = constantExpensive / blxmExpensiveNew;
    
		let profit = usdExpensive - usdExpensiveNew - adjustmentValue;
    
		console.log("poolPriceEth: " + this.poolPriceEth);
		console.log("poolPriceBsc: " + this.poolPriceBsc);
    
		console.log("AdjustmentValue: " + adjustmentValue);
		console.log("profit: " + profit);
    
		console.log("usdcBsc: " + this.usdcBsc + " -> " + "usdcBscNew: " + usdCheapNew);
		console.log("blxmBsc: " + this.blxmBsc + " -> " + "blxmBscNew: " + blxmCheapNew);
		console.log("usdcEth: " + this.usdcEth + " -> " + "usdcEthNew: " + usdExpensiveNew);
		console.log("blxmEth: " + this.blxmEth + " -> " + "blxmEthNew: " + blxmExpensiveNew);
	}

    
	getAdjustmentValueUsd(blxmCheap, usdCheap, blxmExpensive, constantCheap, constantExpensive){

		let adjustmentValue = (Math.sqrt(Math.pow(blxmCheap, 2) * constantCheap * constantExpensive + 2 * blxmCheap * blxmExpensive * constantCheap * constantExpensive + 
        Math.pow(blxmExpensive, 2) * constantCheap * constantExpensive) + 
        Math.pow(blxmCheap, 2) * (-usdCheap) - 2 * blxmCheap * blxmExpensive * usdCheap + blxmCheap * constantCheap - Math.pow(blxmExpensive, 2) * 
        usdCheap + blxmExpensive * constantCheap) / (Math.pow(blxmCheap,2) + 2 *blxmCheap * blxmExpensive + Math.pow(blxmExpensive, 2));
    
		return adjustmentValue;
	}

}

let arbitrage = new ArbitrageService();
arbitrage.startArbitrage();
