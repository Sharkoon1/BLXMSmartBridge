const { ethers } = require("ethers");
const DataBaseService = require("./DataBaseService");
const logger = require("../logger/logger");
const constants = require("../constants");
const BigNumber  = require("bignumber.js");
const app = require("../app");
const ArbitrageContract = require("../contracts/ArbitrageContract");
const OracleContract = require("../contracts/OracleContract");
const DataService = require("./DataService");
const equationSolver = require("../math/equationSolver");

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

			this.stableAmountOut;
			this.basicAmountOut;
	
			this.adjustmentValueStable;
			this.adjustmentValueBasic;
			this.stableProfitAfterGas;

			this.gasLimitBsc;
			this.gasLimitEth;

			this.gasPriceBsc;
			this.gasPriceEth;

			this.slippageEth = new BigNumber(0.99); //default slippageEth
			this.slippageBsc = new BigNumber(0.99); //default slippageBsc
	
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

	async init(){
		if(this._oracleContractBsc === null || this._oracleContractEth === null) {
			let basicTokenAddressEth = await this._arbitrageContractEth.getBasicAddress();
			let stableTokenAddressEth = await this._arbitrageContractEth.getStableAddress();
			this._oracleContractEth = new OracleContract("ETH", basicTokenAddressEth, stableTokenAddressEth);

			let basicTokenAddressBsc = await this._arbitrageContractBsc.getBasicAddress();
			let stableTokenAddressBsc = await this._arbitrageContractBsc.getStableAddress();
			this._oracleContractBsc = new OracleContract("BSC", basicTokenAddressBsc, stableTokenAddressBsc);
		}
	}

	async startArbitrage(){
		await this.init();

		this.stopCycle = false;
		this.isRunning = true;

		try {
			logger.info("Starting the abitrage service ..."); 
 
			await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

			while (!this.poolPriceBsc.eq(this.poolPriceEth)) {
				await this.getArbitrageBalances(); //overwrites this.bscArbitrageBalance and this.ethArbitrageBalance from the arbitrage contract
				await this.getReserves();  //overwrites this.tokenArrayBsc and this.tokenArrayEth with the current reserves from the LPs

				if(Number.parseFloat(this.poolPriceBsc.toString()).toFixed(2) === Number.parseFloat(this.poolPriceEth.toString()).toFixed(2)) {
					logger.info("Prices are currently equal.");
					logger.info("ETH network: Current price = " + this.poolPriceEth + " USD/BLXM");
					logger.info("BSC network: Current price = " + this.poolPriceBsc + " USD/BLXM");

					logger.info("Skipping current arbitrage cycle.");
					await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs
				}

				else {
					logger.info("Price difference found");
					logger.info("ETH network: Current price = " + this.poolPriceEth + " USD/BLXM");
					logger.info("BSC network: Current price = " + this.poolPriceBsc + " USD/BLXM");
		
					if(this.poolPriceEth.gt(this.poolPriceBsc)){
		
						let liquidityAvaible = await this.calculateSwapEth(this.tokenArrayBsc[1], this.tokenArrayBsc[0], this.tokenArrayEth[1], this.tokenArrayEth[0]);
		
						if(!liquidityAvaible) {
							await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs
	
							continue;
						}
	
						if(this.stableProfitAfterGas.gt(0)) {
							await this.swapEth();
						}
		
						else {
							logger.info("ETH: Calculated profit after gas fees: " + this.stableProfitAfterGas + " is negative.");
							logger.info("Skipping current arbitrage cycle...");
	
							await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs
						}
						
					}
		
					else {
						let liquidityAvaible = await this.calculateSwapBsc(this.tokenArrayEth[1], this.tokenArrayEth[0], this.tokenArrayBsc[1], this.tokenArrayBsc[0]);  
	
						if(!liquidityAvaible) {
							await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs
	
							continue;
						}
	
						if(this.stableProfitAfterGas.gt(0)) {
							await this.swapBsc();
						}
						else {
							logger.info("BSC: Calculated profit after gas fees: " + this.stableProfitAfterGas + " is negative.");
							logger.info("Skipping current arbitrage cycle...");
	
							await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs
						}
					
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
		this.adjustmentValueStable = await this.getAdjustmentValueUsdWithFees(basicCheap, stableCheap, basicExpensive, stableExpensive, this.uniswapFees, this.pancakeswapFees);

		this.adjustmentValueBasic = this.amountOut(this.pancakeswapFees, this.adjustmentValueStable, stableCheap, basicCheap);

		logger.info("Adjustment Value stable: " + this.adjustmentValueStable); 
		logger.info("Adjustment Value basic: " + this.adjustmentValueBasic); 

		if(this.adjustmentValueStable.gt(this.bscArbitrageBalance.stable)) { // validate if arbitrage contract has enough stable tokens for swap
			logger.warn("BSC: Arbitrage contract stable balance is less than adjustment value.");
			logger.warn("Stable balance: " + this.bscArbitrageBalance.stable);
			logger.info("Skipping swaps and current cycle...");

			return false;
		}

		if(this.adjustmentValueBasic.gt(this.ethArbitrageBalance.basic)) { // validate if arbitrage contract has enough basic tokens for swap
			logger.warn("ETH: Arbitrage contract basic balance is less than adjustment value.");
			logger.warn("Basic balance: " + this.ethArbitrageBalance.basic);
			logger.info("Skipping swaps and current cycle...");

			return false;
		}

		this.stableProfitAfterGas = await this.calculateSwapProfitEth(); 

		return true;
	}		

	async swapEth(){
		logger.info("Executing swaps...");

		let swapStableToBasicTx = await this._arbitrageContractBsc.swapStableToBasic(this.toEthersBigNumber(this.adjustmentValueStable), this.basicAmountOut, this.gasLimitEth, this.gasPriceEth);
		let swapBasicToStableTx = await this._arbitrageContractEth.swapBasicToStable(this.toEthersBigNumber(this.adjustmentValueBasic), this.stableAmountOut, this.gasLimitBsc, this.gasPriceBsc);
		
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
		this.adjustmentValueStable = await this.getAdjustmentValueUsdWithFees(basicCheap, stableCheap, basicExpensive, stableExpensive, this.pancakeswapFees, this.uniswapFees);

		this.adjustmentValueBasic = this.amountOut(this.uniswapFees, this.adjustmentValueStable, stableCheap, basicCheap);

		logger.info("Adjustment Value stable: " + this.adjustmentValueStable); 
		logger.info("Adjustment Value basic: " + this.adjustmentValueBasic); 
	
		if(this.adjustmentValueStable.gt(this.ethArbitrageBalance.stable)) { // validate if arbitrage contract has enough stable tokens for swap
			logger.warn("ETH: Arbitrage contract stable balance is less than the adjustment value.");
			logger.warn("Stable token balance: " + this.ethArbitrageBalance.stable);
			logger.info("Skipping swaps and current cycle...");

			return false;
		}

		if(this.adjustmentValueBasic.gt(this.bscArbitrageBalance.basicBalance)) { // validate if arbitrage contract has enough basic tokens for swap
			logger.warn("BSC: Arbitrage contract basic balance is less than the adjustment value.");
			logger.warn("Basic token balance: " + this.bscArbitrageBalance.basicBalance);
			logger.info("Skipping swaps and current cycle...");

			return false;
		}

		this.stableProfitAfterGas = await this.calculateSwapProfitBsc();

		return true;
	}

	async swapBsc(){
		logger.info("Executing swaps...");

		let swapStableToBasicTx = await this._arbitrageContractEth.swapStableToBasic(this.toEthersBigNumber(this.adjustmentValueStable), this.basicAmountOut, this.gasLimitEth, this.gasPriceEth);
		let swapBasicToStableTx = await this._arbitrageContractBsc.swapBasicToStable(this.toEthersBigNumber(this.adjustmentValueBasic), this.stableAmountOut, this.gasLimitBsc, this.gasPriceBsc);

		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

		await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

		logger.info("ETH network: price after swap = " + this.poolPriceEth);
		logger.info("BSC network: price after swap = " + this.poolPriceBsc);

		let postStableBalance = await this._arbitrageContractBsc.getStableBalance();
		let realProfit = postStableBalance.minus(this.bscArbitrageBalance.stable);
		
		logger.info("Absolute profit after arbitrage: " + realProfit.toString());
    }

	async calculateSwapProfitEth(){
		
		let basicAmountOut = await this._oracleContractBsc.getsAmountOutBasic(this.toEthersBigNumber(this.adjustmentValueStable));
		this.basicAmountOut = basicAmountOut.mul(ethers.BigNumber.from((this.slippageBsc.multipliedBy(1000).toString()))).div(1000);

		let stableAmountOut = await this._oracleContractEth.getsAmountOutStable(this.basicAmountOut);
		this.stableAmountOut = stableAmountOut.mul(ethers.BigNumber.from((this.slippageEth.multipliedBy(1000).toString()))).div(1000);

		this.gasLimitBsc = await this._arbitrageContractBsc.swapStableToBasicGasLimit(this.toEthersBigNumber(this.adjustmentValueStable), this.basicAmountOut);
		this.gasLimitEth = await this._arbitrageContractEth.swapBasicToStableGasLimit(this.toEthersBigNumber(this.adjustmentValueBasic), this.stableAmountOut);

		this.gasLimitEth = this.gasLimitBuffer(this.gasLimitEth); 
		this.gasLimitBsc = this.gasLimitBuffer(this.gasLimitBsc); 

		// getGasPrice for BSC legacy transactions
		// getFeeData()).maxFeePerGas for ETH EIP-1559
		this.gasPriceBsc = (await this._arbitrageContractBsc.provider.getFeeData()).gasPrice;
		this.gasPriceEth = (await this._arbitrageContractEth.provider.getFeeData()).maxFeePerGas;

		let wethPrice = await this._oracleContractEth.getWrappedPrice();
		let wbnbPrice = await this._oracleContractBsc.getWrappedPrice();

		let totalFeeBsc = this.fromEthersToBigNumber(this.gasPriceBsc.mul(this.gasLimitBsc)).multipliedBy(wbnbPrice);
		let totalFeeEth = this.fromEthersToBigNumber(this.gasPriceEth.mul(this.gasLimitEth)).multipliedBy(wethPrice);
		
		let transactionFees = totalFeeBsc.plus(totalFeeEth);

		let swapProfit = this.fromEthersToBigNumber(this.stableAmountOut).minus(transactionFees);

		logger.info("Maximum sum of transaction fees: " + transactionFees + " USD");
		logger.info("Worst case profit after slippage: " + swapProfit + " USD");

		return swapProfit;  
	}

	async calculateSwapProfitBsc(){
		let basicAmountOut = await this._oracleContractEth.getsAmountOutBasic(this.toEthersBigNumber(this.adjustmentValueStable));
		this.basicAmountOut = basicAmountOut.mul(ethers.BigNumber.from((this.slippageEth.multipliedBy(1000).toString()))).div(1000);

		let stableAmountOut = await this._oracleContractBsc.getsAmountOutStable(this.basicAmountOut);
		this.stableAmountOut = stableAmountOut.mul(ethers.BigNumber.from((this.slippageBsc.multipliedBy(1000).toString()))).div(1000);

		this.gasLimitEth = await this._arbitrageContractEth.swapStableToBasicGasLimit(this.toEthersBigNumber(this.adjustmentValueStable), this.basicAmountOut);
		this.gasLimitBsc = await this._arbitrageContractBsc.swapBasicToStableGasLimit(this.toEthersBigNumber(this.adjustmentValueBasic), this.stableAmountOut);

		this.gasLimitEth = this.gasLimitBuffer(this.gasLimitEth); 
		this.gasLimitBsc = this.gasLimitBuffer(this.gasLimitBsc); 

		// getGasPrice for BSC legacy transactions
		// getFeeData()).maxFeePerGas for ETH EIP-1559
		this.gasPriceBsc = (await this._arbitrageContractBsc.provider.getFeeData()).gasPrice;
		this.gasPriceEth = (await this._arbitrageContractEth.provider.getFeeData()).maxFeePerGas;
		
		let wethPrice = await this._oracleContractEth.getWrappedPrice();
		let wbnbPrice = await this._oracleContractBsc.getWrappedPrice();

		let totalFeeBsc = this.fromEthersToBigNumber(this.gasPriceBsc.mul(this.gasLimitBsc)).multipliedBy(wbnbPrice);
		let totalFeeEth = this.fromEthersToBigNumber(this.gasPriceEth.mul(this.gasLimitEth)).multipliedBy(wethPrice);
		
		let transactionFees = totalFeeBsc.plus(totalFeeEth);

		let swapProfit = this.fromEthersToBigNumber(this.stableAmountOut).minus(transactionFees);

		logger.info("Maximum sum of transaction fees: " + transactionFees + " USD");
		logger.info("Worst case profit after slippage: " + swapProfit + " USD");

		return swapProfit;  
	}

    
	async getAdjustmentValueUsdWithFees(basicCheap, stableCheap, basicExpensive, stableExpensive, feesExpansive, feesCheap) {
		let adjustmentValue = await equationSolver.solveAdjustmentValue(basicCheap.toString(), stableCheap.toString(), basicExpensive.toString(), stableExpensive.toString(), feesExpansive.toString(), feesCheap.toString());
		
		return new BigNumber(adjustmentValue);		
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

	gasLimitBuffer(gasLimit) {
		gasLimit = this.fromEthersToBigNumber(gasLimit);
		gasLimit = gasLimit.multipliedBy(1.1);

		return this.toEthersBigNumber(gasLimit);
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