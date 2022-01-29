const { ethers } = require("ethers");
const DataBaseService = require("./DataBaseService");
const logger = require("../logger/logger");
const constants = require("../constants");
const BigNumber  = require("bignumber.js");
const app = require("../app");
const ArbitrageContract = require("../contracts/ArbitrageContract");
const OracleContract = require("../contracts/OracleContract");
const DataService = require("./DataService");

class ArbitrageService {
	constructor(){
			this._databaseService = DataBaseService;
			this._dataService = DataService;

			this._arbitrageContractEth = new ArbitrageContract("ETH");
			this._arbitrageContractBsc = new ArbitrageContract("BSC");
		
			this._oracleContractBsc = null;
			this._oracleContractEth = null;

			this.poolPriceEth;
			this.poolPriceBsc;

			this.tokenArrayBsc;
			this.tokenArrayEth;
	
			this.adjustmentValueStable;
			this.adjustmentValueBasic;
			this.profitAfterSlippage;
	
			this.stopCycle = false;
			this.isRunning = false;
	
			this.uniswapFees = new BigNumber(constants.UNISWAP_FEES);
			this.pancakeswapFees = new BigNumber(constants.PANCAKESWAP_FEES);
	}

	async init() {
		if(this._oracleContractBsc === null || this._oracleContractEth === null) {
			let basicTokenAddressEth = await this._arbitrageContractEth.getBasicAddress();
			let stableTokenAddressEth = await this._arbitrageContractEth.getStableAddress();
			this._oracleContractEth = new OracleContract("ETH", basicTokenAddressEth, stableTokenAddressEth);

			let basicTokenAddressBsc = await this._arbitrageContractBsc.getBasicAddress();
			let stableTokenAddressBsc = await this._arbitrageContractBsc.getStableAddress();
			this._oracleContractBsc = new OracleContract("BSC", basicTokenAddressBsc, stableTokenAddressBsc);
		}
	}

	async startArbitrage (){
		await this.init();

		this.stopCycle = false;
		this.isRunning = true;

		try {
			logger.info("Starting the abitrage service ..."); 
 
			await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

			while (!this.poolPriceBsc.eq(this.poolPriceEth)) {
				await this.getReserves();
	
				logger.info("Price difference found");
				logger.info("ETH network: Current price = " + this.poolPriceEth + " USD/BLXM");
				logger.info("BSC network: Current price = " + this.poolPriceBsc + " USD/BLXM");
	
				if(this.poolPriceEth.gt(this.poolPriceBsc)){
	
					await this.calculateSwapEth(this.tokenArrayBsc[1], this.tokenArrayBsc[0], this.tokenArrayEth[1], this.tokenArrayEth[0]);
	
					if(this.profitAfterSlippage.gt(0)) {
						await this.swapEth();
					}
	
					else {
						logger.info("ETH: Calculated profit after slippage: " + this.profitAfterSlippage + " is negative.");
						logger.info("Skipping current arbitrage cycle...");
					}
					
				}
	
				else {
					await this.calculateSwapBsc(this.tokenArrayEth[1], this.tokenArrayEth[0], this.tokenArrayBsc[1], this.tokenArrayBsc[0]);  
	
					if(this.profitAfterSlippage.gt(0)) {
						await this.swapBsc();
					}
					else {
						logger.info("BSC: Calculated profit after slippage: " + this.profitAfterSlippage + " is negative.");
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

		this.adjustmentValueStable = this.getAdjustmentValueUsdWithFees(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive);
    
		let stableCheapNew = stableCheap.plus(this.adjustmentValueStable);
		let basicCheapNew = constantCheap.div(stableCheapNew);

		this.adjustmentValueBasic = basicCheap.minus(basicCheapNew); 
        		
		let gasLimitBsc = await this._arbitrageContractBsc.swapStableToBasicGasLimit(this.toEthersBigNumber(this.adjustmentValueStable));
		let gasLimitEth = await this._arbitrageContractEth.swapBasicToStableGasLimit(this.toEthersBigNumber(this.adjustmentValueBasic));

		// getGasPrice for BSC legacy transactions
		// getFeeData()).maxFeePerGas for ETH EIP-1559
		let gasPriceBsc = await this._arbitrageContractBsc.provider.getGasPrice();
		let gasPriceEth = (await this._arbitrageContractEth.provider.getFeeData()).maxFeePerGas;
		
		let totalGasPriceBsc = gasPriceBsc.mul(gasLimitBsc);
		let totalGasPriceEth = gasPriceEth.mul(gasLimitEth);
		
		let transactionFees = totalGasPriceBsc.add(totalGasPriceEth);
		 
		this.profitAfterSlippage = await this.swapSlippageProfitEth(this.fromEthersToBigNumber(transactionFees), basicExpensive, stableExpensive, constantExpensive);
	}		

	async swapEth(){
		let preStableBalance = await this._arbitrageContractEth.getStableBalance();

		let swapStableToBasicTx = await this._arbitrageContractBsc.swapStableToBasic(this.toEthersBigNumber(this.adjustmentValueStable));
		let swapBasicToStableTx = await this._arbitrageContractEth.swapBasicToStable(this.toEthersBigNumber(this.adjustmentValueBasic));
		
		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

		await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

		logger.info("ETH network: price after swap = " + this.poolPriceEth);
		logger.info("BSC network: price after swap = " + this.poolPriceBsc);

		let postStableBalance = await this._arbitrageContractEth.getStableBalance();
		let realProfit = postStableBalance.sub(preStableBalance);
		
		logger.info("Absolute profit after arbitrage: " + ethers.utils.formatEther(realProfit));
	}

	async calculateSwapBsc(basicCheap, stableCheap, basicExpensive, stableExpensive){ // When BSC is more expensive

		let constantCheap = stableCheap.multipliedBy(basicCheap);
		let constantExpensive = stableExpensive.multipliedBy(basicExpensive); 
          
		this.adjustmentValueStable = this.getAdjustmentValueUsdWithFees(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive);

		let stableCheapNew = stableCheap.plus(this.adjustmentValueStable);
		let basicCheapNew = constantCheap.div(stableCheapNew);

		this.adjustmentValueBasic = basicCheap.minus(basicCheapNew);
        
		let gasLimitEth = await this._arbitrageContractEth.swapStableToBasicGasLimit(this.toEthersBigNumber(this.adjustmentValueStable));
		let gasLimitBsc = await this._arbitrageContractBsc.swapBasicToStableGasLimit(this.toEthersBigNumber(this.adjustmentValueBasic));
		
		// getGasPrice for BSC legacy transactions
		// getFeeData()).maxFeePerGas for ETH EIP-1559
		let gasPriceBsc = await this._arbitrageContractBsc.provider.getGasPrice();
		let gasPriceEth = (await this._arbitrageContractEth.provider.getFeeData()).maxFeePerGas;
		
		let totalGasPriceBsc = gasPriceBsc.mul(gasLimitBsc);
		let totalGasPriceEth = gasPriceEth.mul(gasLimitEth);
		
		let transactionFees = totalGasPriceBsc.add(totalGasPriceEth);

		this.profitAfterSlippage = await this.swapSlippageProfitBsc(this.fromEthersToBigNumber(transactionFees), basicExpensive, stableExpensive, constantExpensive);
	}

	async swapBsc(){

		let preStableBalance = await this._arbitrageContractBsc.getStableBalance();

		let swapStableToBasicTx = await this._arbitrageContractEth.swapStableToBasic(this.toEthersBigNumber(this.adjustmentValueStable));
		let swapBasicToStableTx = await this._arbitrageContractBsc.swapBasicToStable(this.toEthersBigNumber(this.adjustmentValueBasic));

		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

		await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

		logger.info("ETH network: price after swap = " + this.poolPriceEth);
		logger.info("BSC network: price after swap = " + this.poolPriceBsc);

		let postStableBalance = await this._arbitrageContractBsc.getStableBalance();
		let realProfit = postStableBalance.sub(preStableBalance);
		
		logger.info("Absolute profit after arbitrage: " + ethers.utils.formatEther(realProfit));
    }

	async swapSlippageProfitEth(sumFees, basicExpensive, stableExpensive, constantExpensive){

		let standardDeviationEth = await this._dataService.getStandardDeviation("ETH");
		let standardDeviationBsc = await this._dataService.getStandardDeviation("BSC");

		let slippagePriceBsc = this.poolPriceBsc.plus(standardDeviationBsc);
		let slippagePriceEth = this.poolPriceEth.minus(standardDeviationEth);

		let basicSlippageGain = this.poolPriceBsc.dividedBy(slippagePriceBsc).multipliedBy(this.adjustmentValueBasic);
		
		let basicExpensiveNew = basicExpensive.plus(basicSlippageGain);
		let stableExpensiveNew = constantExpensive.div(basicExpensiveNew);
    
		let stableSlippageGain = stableExpensive.minus(stableExpensiveNew).minus(this.adjustmentValueStable);

		let profitAfterSlippage = slippagePriceEth.dividedBy(this.poolPriceEth).multipliedBy(stableSlippageGain);

		let swapProfit = profitAfterSlippage.minus(sumFees);

		logger.info("Maximum sum of transaction fees: " + sumFees);
		logger.info("Worst case profit after slippage: " + swapProfit);

		return swapProfit;  
	}

	async swapSlippageProfitBsc(sumFees, basicExpensive, stableExpensive, constantExpensive){

		let standardDeviationEth = await this._dataService.getStandardDeviation("ETH");
		let standardDeviationBsc = await this._dataService.getStandardDeviation("BSC");

		let slippagePriceEth = this.poolPriceEth.plus(standardDeviationEth);
		let slippagePriceBsc = this.poolPriceBsc.minus(standardDeviationBsc);

		let basicSlippageGain = this.poolPriceEth.dividedBy(slippagePriceEth).multipliedBy(this.adjustmentValueBasic);
		
		let basicExpensiveNew = basicExpensive.plus(basicSlippageGain);
		let stableExpensiveNew = constantExpensive.dividedBy(basicExpensiveNew);
    
		let stableSlippageGain = stableExpensive.minus(stableExpensiveNew).minus(this.adjustmentValueStable);

		let profitAfterSlippage = slippagePriceBsc.dividedBy(this.poolPriceBsc).multipliedBy(stableSlippageGain);

		let swapProfit = profitAfterSlippage.minus(sumFees);

		logger.info("Maximum sum of transaction fees: " + sumFees);
		logger.info("Worst case profit after slippage: " + swapProfit);

		return swapProfit;  
	}

    
	getAdjustmentValueUsdWithFees(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive) {

		let term1 = basicCheap.exponentiatedBy(2).multipliedBy(constantCheap).multipliedBy(constantExpensive).multipliedBy(this.pancakeswapFees.exponentiatedBy(2)).multipliedBy(this.uniswapFees.exponentiatedBy(2));
		let term2 = (new BigNumber("2")).multipliedBy(basicCheap).multipliedBy(basicExpensive).multipliedBy(constantCheap).multipliedBy(constantExpensive).multipliedBy(this.pancakeswapFees.exponentiatedBy(2)).multipliedBy(this.uniswapFees);
		let term3 = basicExpensive.exponentiatedBy(2).multipliedBy(constantCheap).multipliedBy(constantExpensive).multipliedBy(this.pancakeswapFees.exponentiatedBy(2));
		let term4 = basicCheap.exponentiatedBy(2).multipliedBy(this.pancakeswapFees).multipliedBy(this.uniswapFees.exponentiatedBy(2)).multipliedBy(stableCheap);
		let term5 = (new BigNumber("2")).multipliedBy(basicCheap).multipliedBy(basicExpensive).multipliedBy(this.pancakeswapFees).multipliedBy(this.uniswapFees).multipliedBy(stableCheap);
		let term6 = basicCheap.multipliedBy(constantCheap).multipliedBy(this.pancakeswapFees).multipliedBy(this.uniswapFees.exponentiatedBy(2));
		let term7 = basicExpensive.exponentiatedBy(2).multipliedBy(this.pancakeswapFees).multipliedBy(stableCheap);
		let term8 = basicExpensive.multipliedBy(constantCheap).multipliedBy(this.pancakeswapFees).multipliedBy(this.uniswapFees);
		let term9 = basicCheap.exponentiatedBy(2).multipliedBy(this.pancakeswapFees.exponentiatedBy(2)).multipliedBy(this.uniswapFees.exponentiatedBy(2));
		let term10 = (new BigNumber("2")).multipliedBy(basicCheap).multipliedBy(basicExpensive).multipliedBy(this.pancakeswapFees.exponentiatedBy(2)).multipliedBy(this.uniswapFees);
		let term11 = basicExpensive.exponentiatedBy(2).multipliedBy(this.pancakeswapFees.exponentiatedBy(2));
		
		let term1_8 = ((term1.plus(term2).plus(term3)).squareRoot()).minus(term4).minus(term5).plus(term6).minus(term7).plus(term8);
		let term9_11 = term9.plus(term10).plus(term11);
		
		let adjustmentValue = term1_8.dividedBy(term9_11);
		
		return adjustmentValue;		
	}

	async getPoolPrices(){
		this.poolPriceBsc = await this._oracleContractBsc.getPrice();
		this.poolPriceEth = await this._oracleContractEth.getPrice();
	}

	async getReserves(){
        this.tokenArrayBsc = await this._oracleContractBsc.getReserves(); //tokenArrayBsc[0] = stableBsc, tokenArrayBsc[1] = basicBsc
        this.tokenArrayEth = await this._oracleContractEth.getReserves(); //tokenArrayEth[0] = stableEth, tokenArrayEth[1] = basicEth
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