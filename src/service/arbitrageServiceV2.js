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
			this.ethArbitrageBalance = { stable: 0, basic: 0};
			this.bscArbitrageBalance = { stable: 0, basic: 0};

			this.tokenArrayBsc;
			this.tokenArrayEth;
	
			this.adjustmentValueStable;
			this.adjustmentValueBasic;
			this.stableProfitAfterGas;

			this.slippageEth = new BigNumber(1);
			this.slippageBsc = new BigNumber(1);
	
			this.stopCycle = false;
			this.isRunning = false;
	
			if (process.env.NODE_ENV === "production") {
				this.uniswapFees = new BigNumber(constants.UNISWAP_FEES);
				this.pancakeswapFees = new BigNumber(constants.PANCAKESWAP_FEES);
			}
			else {
				this.uniswapFees = new BigNumber(constants.UNISWAP_FEES_TESTNET);
				this.pancakeswapFees = new BigNumber(constants.PANCAKESWAP_FEES_TESTNET);
			}
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
				await this.getArbitrageBalances(); //overwrites this.bscArbitrageBalance and this.ethArbitrageBalance from the arbitrage contract
				await this.getReserves();  //overwrites this.tokenArrayBsc and this.tokenArrayEth with the current reserves from the LPs
	
				logger.info("Price difference found");
				logger.info("ETH network: Current price = " + this.poolPriceEth + " USD/BLXM");
				logger.info("BSC network: Current price = " + this.poolPriceBsc + " USD/BLXM");
	
				if(this.poolPriceEth.gt(this.poolPriceBsc)){
	
					await this.calculateSwapEth(this.tokenArrayBsc[1], this.tokenArrayBsc[0], this.tokenArrayEth[1], this.tokenArrayEth[0]);
	
					if(this.stableProfitAfterGas.gt(0)) {
						await this.swapEth();
					}
	
					else {
						logger.info("ETH: Calculated profit after gas fees: " + this.stableProfitAfterGas + " is negative.");
						logger.info("Skipping current arbitrage cycle...");
					}
					
				}
	
				else {
					await this.calculateSwapBsc(this.tokenArrayEth[1], this.tokenArrayEth[0], this.tokenArrayBsc[1], this.tokenArrayBsc[0]);  
	
					if(this.stableProfitAfterGas.gt(0)) {
						await this.swapBsc();
					}
					else {
						logger.info("BSC: Calculated profit after gas fees: " + this.stableProfitAfterGas + " is negative.");
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
		this.adjustmentValueStable = this.getAdjustmentValueUsdWithFees(basicCheap, stableCheap, basicExpensive, stableExpensive);

		this.adjustmentValueBasic = this.amountOut(this.pancakeswapFees, this.adjustmentValueStable, stableCheap, basicCheap);
		 
		this.stableProfitAfterGas = await this.calculateSwapProfitEth(basicExpensive, stableExpensive);

		logger.info("Adjustment Value stable: " + this.adjustmentValueStable); 
		logger.info("Adjustment Value basic: " + this.adjustmentValueBasic);    
	}		

	async swapEth(){
		logger.info("Executing swaps...");

		if(this.adjustmentValueStable.gt(this.bscArbitrageBalance.stable)) { // validate if arbitrage contract has enough stable tokens for swap
			logger.warn("BSC: Arbitrage contract stable balance is less than adjustment value.");
			logger.warn("Stable balance: " + this.bscArbitrageBalance.stable);
			logger.info("Skipping swaps and current cycle...");

			return;
		}

		let swapStableToBasicTx = await this._arbitrageContractBsc.swapStableToBasic(this.toEthersBigNumber(this.adjustmentValueStable));
		
		if(this.adjustmentValueBasic.gt(this.ethArbitrageBalance.basic)) { // validate if arbitrage contract has enough basic tokens for swap
			logger.warn("ETH: Arbitrage contract basic balance is less than adjustment value.");
			logger.warn("Basic balance: " + this.ethArbitrageBalance.basic);
			logger.info("Skipping swaps and current cycle...");

			return;
		}

		let swapBasicToStableTx = await this._arbitrageContractEth.swapBasicToStable(this.toEthersBigNumber(this.adjustmentValueBasic));
		
		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

		await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

		logger.info("ETH network: price after swap = " + this.poolPriceEth);
		logger.info("BSC network: price after swap = " + this.poolPriceBsc);

		let postStableBalance = await this._arbitrageContractEth.getStableBalance();
		let realProfit = postStableBalance.minus(this.ethArbitrageBalance.stable);
		
		logger.info("Absolute profit after arbitrage: " + realProfit.toString());
	}

	async calculateSwapBsc(basicCheap, stableCheap, basicExpensive, stableExpensive){ // When BSC is more expensive  
		this.adjustmentValueStable = this.getAdjustmentValueUsdWithFees(basicCheap, stableCheap, basicExpensive, stableExpensive);

		this.adjustmentValueBasic = this.amountOut(this.uniswapFees, this.adjustmentValueStable, stableCheap, basicCheap);

		this.stableProfitAfterGas = await this.calculateSwapProfitBsc(basicExpensive, stableExpensive);

		logger.info("Adjustment Value stable: " + this.adjustmentValueStable); 
		logger.info("Adjustment Value basic: " + this.adjustmentValueBasic);    
	}

	async swapBsc(){
		logger.info("Executing swaps...");

		if(this.adjustmentValueStable.gt(this.ethArbitrageBalance.stable)) { // validate if arbitrage contract has enough stable tokens for swap
			logger.warn("ETH: Arbitrage contract stable balance is less than the adjustment value.");
			logger.warn("Stable token balance: " + this.ethArbitrageBalance.stable);
			logger.info("Skipping swaps and current cycle...");

			return;
		}

		let swapStableToBasicTx = await this._arbitrageContractEth.swapStableToBasic(this.toEthersBigNumber(this.adjustmentValueStable));

		if(this.adjustmentValueBasic.gt(this.bscArbitrageBalance.basicBalance)) { // validate if arbitrage contract has enough basic tokens for swap
			logger.warn("BSC: Arbitrage contract basic balance is less than the adjustment value.");
			logger.warn("Basic token balance: " + this.bscArbitrageBalance.basicBalance);
			logger.info("Skipping swaps and current cycle...");

			return;
		}

		let swapBasicToStableTx = await this._arbitrageContractBsc.swapBasicToStable(this.toEthersBigNumber(this.adjustmentValueBasic));

		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

		await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

		logger.info("ETH network: price after swap = " + this.poolPriceEth);
		logger.info("BSC network: price after swap = " + this.poolPriceBsc);

		let postStableBalance = await this._arbitrageContractBsc.getStableBalance();
		let realProfit = postStableBalance.minus(this.bscArbitrageBalance.stable);
		
		logger.info("Absolute profit after arbitrage: " + realProfit.toString());
    }

	async calculateSwapProfitEth(basicExpensive, stableExpensive){
		let gasLimitBsc = await this._arbitrageContractBsc.swapStableToBasicGasLimit(this.toEthersBigNumber(this.adjustmentValueStable));
		let gasLimitEth = await this._arbitrageContractEth.swapBasicToStableGasLimit(this.toEthersBigNumber(this.adjustmentValueBasic));

		// getGasPrice for BSC legacy transactions
		// getFeeData()).maxFeePerGas for ETH EIP-1559
		let gasPriceBsc = (await this._arbitrageContractBsc.provider.getFeeData()).gasPrice;
		let gasPriceEth = (await this._arbitrageContractEth.provider.getFeeData()).maxFeePerGas;

		let wethPrice = await this._oracleContractEth.getWrappedPrice();
		let wbnbPrice = await this._oracleContractBsc.getWrappedPrice();

		let totalFeeBsc = this.fromEthersToBigNumber(gasPriceBsc.mul(gasLimitBsc)).multipliedBy(wbnbPrice);
		let totalFeeEth = this.fromEthersToBigNumber(gasPriceEth.mul(gasLimitEth)).multipliedBy(wethPrice);
		
		let transactionFees = totalFeeBsc.plus(totalFeeEth);

		let basicAmountOut = this.adjustmentValueBasic.multipliedBy(this.slippageBsc);

		let stableAmountOut = this.amountOut(this.uniswapFees, basicAmountOut, basicExpensive, stableExpensive).multipliedBy(this.slippageEth);

		let swapProfit = stableAmountOut.minus(transactionFees);

		logger.info("Maximum sum of transaction fees: " + transactionFees);
		logger.info("Worst case profit after slippage: " + swapProfit);

		return swapProfit;  
	}

	async calculateSwapProfitBsc(basicExpensive, stableExpensive){

		let gasLimitEth = await this._arbitrageContractEth.swapStableToBasicGasLimit(this.toEthersBigNumber(this.adjustmentValueStable));
		let gasLimitBsc = await this._arbitrageContractBsc.swapBasicToStableGasLimit(this.toEthersBigNumber(this.adjustmentValueBasic));
		
		// getGasPrice for BSC legacy transactions
		// getFeeData()).maxFeePerGas for ETH EIP-1559
		let gasPriceBsc = (await this._arbitrageContractBsc.provider.getFeeData()).gasPrice;
		let gasPriceEth = (await this._arbitrageContractEth.provider.getFeeData()).maxFeePerGas;
		
		let wethPrice = await this._oracleContractEth.getWrappedPrice();
		let wbnbPrice = await this._oracleContractBsc.getWrappedPrice();

		let totalFeeBsc = this.fromEthersToBigNumber(gasPriceBsc.mul(gasLimitBsc)).multipliedBy(wbnbPrice);
		let totalFeeEth = this.fromEthersToBigNumber(gasPriceEth.mul(gasLimitEth)).multipliedBy(wethPrice);
		
		let transactionFees = totalFeeBsc.plus(totalFeeEth);

		let basicAmountOut = this.adjustmentValueBasic.multipliedBy(this.slippageEth);
		
		let stableAmountOut = this.amountOut(this.pancakeswapFees, basicAmountOut, basicExpensive, stableExpensive).multipliedBy(this.slippageBsc);

		let swapProfit = stableAmountOut.minus(transactionFees);

		logger.info("Maximum sum of transaction fees: " + transactionFees.toString());
		logger.info("Worst case profit after slippage: " + swapProfit.toString());

		return swapProfit;  
	}

    
	getAdjustmentValueUsdWithFees(basicCheap, stableCheap, basicExpensive, stableExpensive) {
		let constantCheap = stableCheap.multipliedBy(basicCheap);
		let constantExpensive = stableExpensive.multipliedBy(basicExpensive);   

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

	amountOut(fees, input, inputReserve, outputReserve) {
		let amountInWithFees = input.multipliedBy(fees.multipliedBy(1000));
		let numerator = amountInWithFees.multipliedBy(outputReserve);
		let denominator = inputReserve.multipliedBy(1000).plus(amountInWithFees);
		
		return numerator.dividedBy(denominator);
	}

	async getPoolPrices(){
		this.poolPriceBsc = await this._oracleContractBsc.getPrice();
		this.poolPriceEth = await this._oracleContractEth.getPrice();
	}

	async getReserves(){
        this.tokenArrayBsc = await this._oracleContractBsc.getReserves(); //tokenArrayBsc[0] = stableBsc, tokenArrayBsc[1] = basicBsc
        this.tokenArrayEth = await this._oracleContractEth.getReserves(); //tokenArrayEth[0] = stableEth, tokenArrayEth[1] = basicEth
    }

	async getArbitrageBalances(){
        let ethBasicBalance = await this._arbitrageContractEth.getBasicBalance(); 
        let ethStableBalance = await this._arbitrageContractEth.getStableBalance();

		this.ethArbitrageBalance = { basic: ethBasicBalance, stable: ethStableBalance};

        let bscBasicBalance = await this._arbitrageContractBsc.getBasicBalance(); 
        let bscStableBalance = await this._arbitrageContractBsc.getStableBalance();

		this.bscArbitrageBalance = { basic: bscBasicBalance, stable: bscStableBalance};
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