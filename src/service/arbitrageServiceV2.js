const { ethers } = require("ethers");
const DataBaseService = require("./DataBaseService");
const logger = require("../logger/logger");
const constants = require("../constants");
const BigNumber = require("bignumber.js");
const app = require("../app");
const ArbitrageContract = require("../contracts/ArbitrageContract");
const OracleContract = require("../contracts/OracleContract");
const DataService = require("./DataService");
const equationSolver = require("../math/equationSolver");

class ArbitrageService {
	constructor() {
		this._databaseService = DataBaseService;
		this._dataService = DataService;

		this._arbitrageContractEth = new ArbitrageContract("ETH");
		this._arbitrageContractBsc = new ArbitrageContract("BSC");

		this._oracleContractBsc = null;
		this._oracleContractEth = null;

		this.poolPriceEth;
		this.poolPriceBsc;
		this.ethArbitrageBalance = { stable: 0, basic: 0 };
		this.bscArbitrageBalance = { stable: 0, basic: 0 };

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
		
		this.usdExchangeRateBsc;
		this.usdExchangeRateEth;
		
		BigNumber.config({ EXPONENTIAL_AT: [-100, 100] });
		
		this.slippageEth = new BigNumber(0.99); //default slippageEth
		this.slippageBsc = new BigNumber(0.99); //default slippageBsc
		
		this.switchMaxSwapAmount = false; //boolean to get switched by the frontend

		this.maxSwapAmountStable = new BigNumber(0); //value is set in the frontend
		this.maxSwapAmountBasic = new BigNumber(0); //value is set in the frontend

		this.stopCycle = false;
		this.isRunning = false;

		this.uniswapTokenNames = {stableTokenName: "", basicTokenName: ""};
		this.pancakeswapTokenNames = {stableTokenName: "", basicTokenName: ""};

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
		if (this._oracleContractBsc === null || this._oracleContractEth === null) {
			let basicTokenAddressEth = await this._arbitrageContractEth.getBasicAddress();
			let stableTokenAddressEth = await this._arbitrageContractEth.getStableAddress();
			this._oracleContractEth = new OracleContract("ETH", basicTokenAddressEth, stableTokenAddressEth);

			let basicTokenAddressBsc = await this._arbitrageContractBsc.getBasicAddress();
			let stableTokenAddressBsc = await this._arbitrageContractBsc.getStableAddress();
			this._oracleContractBsc = new OracleContract("BSC", basicTokenAddressBsc, stableTokenAddressBsc);
			this.uniswapTokenNames = await DataService.getTokenNamesLiquidity("ETH");
			this.pancakeswapTokenNames = await DataService.getTokenNamesLiquidity("BSC");
		}
	}

	async startArbitrage() {
		await this.init();

		this.stopCycle = false;
		this.isRunning = true;

		const delay = ms => new Promise(res => setTimeout(res, ms));

		try {
			logger.info("Starting the abitrage service ...");

			await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

			while (!this.poolPriceBsc.eq(this.poolPriceEth)) {
				await this.getArbitrageBalances(); //overwrites this.bscArbitrageBalance and this.ethArbitrageBalance from the arbitrage contract
				await this.getReserves();  //overwrites this.tokenArrayBsc and this.tokenArrayEth with the current reserves from the LPs

				if (Number.parseFloat(this.poolPriceBsc.toString()).toFixed(4) === Number.parseFloat(this.poolPriceEth.toString()).toFixed(4)) {
					logger.info("Prices are currently equal");
					logger.info(`ETH network: Current price = ${this.poolPriceEth} USD/BLXM`);
					logger.info(`BSC network: Current price = ${this.poolPriceBsc} USD/BLXM`);

					logger.info("Skipping current arbitrage cycle.");
					await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs
				}

				else {
					logger.info("Price difference found");
					logger.info(`ETH network: Current price = ${this.poolPriceEth} USD/BLXM`);
					logger.info(`BSC network: Current price = ${this.poolPriceBsc} USD/BLXM`);

					if (this.poolPriceEth.gt(this.poolPriceBsc)) {

						let liquidityAvaible = await this.calculateSwapEth(this.tokenArrayBsc[1], this.tokenArrayBsc[0], this.tokenArrayEth[1], this.tokenArrayEth[0]);

						if (!liquidityAvaible) {
							await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

							if (this.stopCycle) {
								logger.info("The arbitrage service has been stopped and the last cycle has been completed.");

								this.isRunning = false;
								app.logEvent.emit("cycleCompleted", true);
								break;
							}
							else {
								continue;
							}
						}

						if (this.stableProfitAfterGas.gt(0)) {
							await this.swapEth();
						}

						else {
							logger.info(`ETH: Calculated profit after gas fees: ${this.stableProfitAfterGas} is negative.`);
							logger.info("Skipping current arbitrage cycle...");

							await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs
						}

					}

					else {
						let liquidityAvaible = await this.calculateSwapBsc(this.tokenArrayEth[1], this.tokenArrayEth[0], this.tokenArrayBsc[1], this.tokenArrayBsc[0]);

						if (!liquidityAvaible) {
							await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

							if (this.stopCycle) {
								logger.info("The arbitrage service has been stopped and the last cycle has been completed.");

								this.isRunning = false;
								app.logEvent.emit("cycleCompleted", true);
								break;
							}
							else {
								continue;
							}
						}

						if (this.stableProfitAfterGas.gt(0)) {
							await this.swapBsc();
						}
						else {
							logger.info(`BSC: Calculated profit after gas fees: ${this.stableProfitAfterGas} is negative.`);
							logger.info("Skipping current arbitrage cycle...");

							await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs
						}

					}
				}

				if (this.stopCycle) {
					logger.info("The arbitrage service has been stopped and the last cycle has been completed.");

					this.isRunning = false;
					app.logEvent.emit("cycleCompleted", true);
					break;
				}

				await delay(2000);			
			}

			this.isRunning = false;
		}
		catch (error) {
			if (error.error && error.error.code === -32016){
				logger.error("Arbitrage service failed due to a too small maximum swap amount value. Please enter a higher value.");
			} else {
				logger.error("Arbitrage service failed. Error: " + error);
			}
			
			logger.error("Service stopped ...");

			app.logEvent.emit("cycleCompleted", true);
			this.isRunning = false;
		}
	}

	async calculateSwapEth(basicCheap, stableCheap, basicExpensive, stableExpensive) { // When ETH is more expensive
		await this.getUsdExchangeRates(); //overwrites this.usdExchangeRateBsc and this.usdExchangeRateEth from the arbitrage contract

		// convert stable to usd to get correct adjustment value to adjust prices
		let stableBsc = this.convertStableToUsdBsc(stableCheap);
		let stableEth = this.convertStableToUsdEth(stableExpensive);

		let adjustmentValueStableUsd = await this.getAdjustmentValueUsdWithFees(basicCheap, stableBsc, basicExpensive, stableEth, this.uniswapFees, this.pancakeswapFees);

		this.adjustmentValueStable = await this.convertUsdToStableBsc(adjustmentValueStableUsd);
		this.adjustmentValueBasic = this.amountOut(this.pancakeswapFees, this.adjustmentValueStable, stableCheap, basicCheap);

		if(this.adjustmentValueStable.lt(ethers.constants.Zero) || this.adjustmentValueBasic.lt(ethers.constants.Zero)) { // in case wrong reserves 
			await this.getReserves();  //overwrites this.tokenArrayBsc and this.tokenArrayEth with the current reserves from the LPs
			await this.calculateSwapEth(this.tokenArrayBsc[1], this.tokenArrayBsc[0], this.tokenArrayEth[1], this.tokenArrayEth[0]);
		}

		logger.info(`Adjustment Value stable: ${this.adjustmentValueStable} ${this.pancakeswapTokenNames.stableTokenName}`);
		logger.info(`Adjustment Value basic: ${this.adjustmentValueBasic} ${this.uniswapTokenNames.basicTokenName}`);

		this.setMaxSwapAmount(this.pancakeswapFees, stableCheap, basicCheap, this.pancakeswapTokenNames.stableTokenName, this.uniswapTokenNames.basicTokenName); //sets adjustmentValueStable & adjustmentValueBasic to the max amount set in the frontend under certain conditions

		if (this.adjustmentValueStable.gt(this.bscArbitrageBalance.stable)) { // validate if arbitrage contract has enough stable tokens for swap
			logger.warn("BSC: Arbitrage contract stable balance is less than adjustment value.");
			logger.warn(`Stable balance: ${this.bscArbitrageBalance.stable}`);

			if(this.bscArbitrageBalance.stable.eq(ethers.constants.Zero)) {
				logger.info("Stable balance is zero.");
				logger.info("Skipping swaps and current cycle...");

				return false;
			}

			this.adjustmentValueStable = this.bscArbitrageBalance.stable;
			this.adjustmentValueBasic = this.amountOut(this.pancakeswapFees, this.adjustmentValueStable, stableCheap, basicCheap);

			logger.warn("Set adjustment stable to stable balance, to swap what is left.");
			logger.warn(`New adjustment Value stable: ${this.adjustmentValueStable} ${this.pancakeswapTokenNames.stableTokenName} `);
		}

		if (this.adjustmentValueBasic.gt(this.ethArbitrageBalance.basic)) { // validate if arbitrage contract has enough basic tokens for swap
			logger.warn("ETH: Arbitrage contract basic balance is less than adjustment value.");
			logger.warn(`Basic balance: ${this.ethArbitrageBalance.basic}`);

			if(this.ethArbitrageBalance.basic.eq(ethers.constants.Zero)) {
				logger.info("Basic balance is zero.");
				logger.info("Skipping swaps and current cycle...");

				return false;
			}

			this.adjustmentValueBasic = this.ethArbitrageBalance.basic;
			this.adjustmentValueStable = this.amountIn(this.pancakeswapFees, this.adjustmentValueBasic, stableReserve, basicReserve);

			logger.warn("Set adjustment basic to basic balance, to swap what is left.");
			logger.info(`New adjustment Value basic: ${this.adjustmentValueBasic} ${this.uniswapTokenNames.basicTokenName}`);
		}

		this.stableProfitAfterGas = await this.calculateSwapProfitEth();

		return true;
	}

	async swapEth() {
		logger.info("Executing swaps...");

		let swapStableToBasicTx = await this._arbitrageContractBsc.swapStableToBasic(this.toEthersBigNumber(this.adjustmentValueStable), this.basicAmountOut, this.gasLimitEth, this.gasPriceEth);
		let swapBasicToStableTx = await this._arbitrageContractEth.swapBasicToStable(this.toEthersBigNumber(this.adjustmentValueBasic), this.stableAmountOut, this.gasLimitBsc, this.gasPriceBsc);

		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

		await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

		logger.info(`ETH network: price after swap = ${this.poolPriceEth} USD/BLXM`);
		logger.info(`BSC network: price after swap = ${this.poolPriceBsc} USD/BLXM`);

		let postStableBalance = await this._arbitrageContractEth.getStableBalance();
		let realProfit = postStableBalance.minus(this.ethArbitrageBalance.stable);

		// get usd profit
		let profitUsd = await this.convertStableToUsdEth(realProfit);

		logger.info(`Absolute profit after arbitrage: ${profitUsd.toString()} USD`);
	}

	async calculateSwapBsc(basicCheap, stableCheap, basicExpensive, stableExpensive) { // When BSC is more expensive  
		await this.getUsdExchangeRates(); //overwrites this.usdExchangeRateBsc and this.usdExchangeRateEth from the arbitrage contract

		// convert stable to usd to get correct adjustment value to adjust prices
		let stableBsc = this.convertStableToUsdBsc(stableExpensive);
		let stableEth = this.convertStableToUsdEth(stableCheap);

		let adjustmentValueStableUsd = await this.getAdjustmentValueUsdWithFees(basicCheap, stableEth, basicExpensive, stableBsc, this.pancakeswapFees, this.uniswapFees);

		this.adjustmentValueStable = await this.convertUsdToStableEth(adjustmentValueStableUsd);

		this.adjustmentValueBasic = this.amountOut(this.uniswapFees, this.adjustmentValueStable, stableCheap, basicCheap);

		if(this.adjustmentValueStable.lt(ethers.constants.Zero) || this.adjustmentValueBasic.lt(ethers.constants.Zero)) {
			await this.getReserves();  //overwrites this.tokenArrayBsc and this.tokenArrayEth with the current reserves from the LPs
			await this.calculateSwapBsc(this.tokenArrayEth[1], this.tokenArrayEth[0], this.tokenArrayBsc[1], this.tokenArrayBsc[0]);
		}

		logger.info(`Adjustment Value stable: ${this.adjustmentValueStable} ${this.uniswapTokenNames.stableTokenName}`);
		logger.info(`Adjustment Value basic: ${this.adjustmentValueBasic}  ${this.pancakeswapTokenNames.basicTokenName}`);

		this.setMaxSwapAmount(this.uniswapFees, stableCheap, basicCheap, this.uniswapTokenNames.stableTokenName, this.pancakeswapTokenNames.basicTokenName); //sets adjustmentValueStable & adjustmentValueBasic to the max amount set in the frontend under certain conditions
		
		if (this.adjustmentValueStable.gt(this.ethArbitrageBalance.stable)) { // validate if arbitrage contract has enough stable tokens for swap
			logger.warn("ETH: Arbitrage contract stable balance is less than the adjustment value.");
			logger.warn(`Stable token balance: ${this.ethArbitrageBalance.stable}`);

			if(this.ethArbitrageBalance.stable.eq(ethers.constants.Zero)) {
				logger.warn("Stable balance is zero.");
				logger.info("Skipping swaps and current cycle...");

				return false;
			}

			this.adjustmentValueStable = this.ethArbitrageBalance.stable;
			this.adjustmentValueBasic = this.amountOut(this.uniswapFees, this.adjustmentValueStable, stableCheap, basicCheap);

			logger.warn("Set adjustment stable to stable balance, to swap what is left.");
			logger.warn(`New adjustment Value stable: ${this.adjustmentValueStable} ${this.uniswapTokenNames.stableTokenName}`);
		}
		let adjustbasic = this.adjustmentValueBasic.toString()
		let basicBalance = his.bscArbitrageBalance.basic.toString()
		console.log(adjustbasic)
		console.log(basicBalance)
		if (this.adjustmentValueBasic.gt(this.bscArbitrageBalance.basic)) { // validate if arbitrage contract has enough basic tokens for swap
			logger.warn("BSC: Arbitrage contract basic balance is less than the adjustment value.");
			logger.warn(`Basic token balance: ${this.bscArbitrageBalance.basic}`);

			if(this.bscArbitrageBalance.basic.eq(ethers.constants.Zero)) {
				logger.warn("Basic balance is zero.");
				logger.info("Skipping swaps and current cycle...");

				return false;
			}

			this.adjustmentValueBasic = this.bscArbitrageBalance.basic;
			this.adjustmentValueStable = this.amountIn(this.uniswapFees, this.adjustmentValueBasic, stableReserve, basicReserve);

			logger.info("Set adjustment basic to basic balance, to swap what is left.");
			logger.info(`New adjustment Value basic: ${this.adjustmentValueBasic} ${this.pancakeswapTokenNames.basicTokenName}`);
		}

		this.stableProfitAfterGas = await this.calculateSwapProfitBsc();

		return true;
	}

	async swapBsc() {
		logger.info("Executing swaps...");

		let swapStableToBasicTx = await this._arbitrageContractEth.swapStableToBasic(this.toEthersBigNumber(this.adjustmentValueStable), this.basicAmountOut, this.gasLimitEth, this.gasPriceEth);
		let swapBasicToStableTx = await this._arbitrageContractBsc.swapBasicToStable(this.toEthersBigNumber(this.adjustmentValueBasic), this.stableAmountOut, this.gasLimitBsc, this.gasPriceBsc);

		await swapStableToBasicTx.wait(); //waits for the promise of swapStableToBasic to be resolved
		await swapBasicToStableTx.wait(); //waits for the promise of swapBasicToStable to be resolved

		await this.getPoolPrices(); //overwrites this.poolPriceEth and this.poolPriceBsc with the current price from the LPs

		logger.info(`ETH network: price after swap = ${this.poolPriceEth} USD/BLXM`);
		logger.info(`BSC network: price after swap = ${this.poolPriceBsc} USD/BLXM`);

		let postStableBalance = await this._arbitrageContractBsc.getStableBalance();
		let realProfit = postStableBalance.minus(this.bscArbitrageBalance.stable);

		// get usd profit
		let profitUsd = await this.convertStableToUsdBsc(realProfit);

		logger.info(`Absolute profit after arbitrage: ${profitUsd.toString()} USD`);
	}

	async calculateSwapProfitEth() {
		let basicAmountOut = await this._oracleContractBsc.getsAmountOutBasic(this.toEthersBigNumber(this.adjustmentValueStable));

		let power = this.decimalShift(this.slippageBsc);

		this.basicAmountOut = basicAmountOut.mul(ethers.BigNumber.from((this.slippageBsc.multipliedBy(power).toString()))).div(power);

		let stableAmountOut = await this._oracleContractEth.getsAmountOutStable(this.basicAmountOut);
		this.stableAmountOut = stableAmountOut.mul(ethers.BigNumber.from((this.slippageEth.multipliedBy(power).toString()))).div(power);

		this.gasLimitBsc = await this._arbitrageContractBsc.swapStableToBasicGasLimit(this.toEthersBigNumber(this.adjustmentValueStable), this.basicAmountOut);
		this.gasLimitEth = await this._arbitrageContractEth.swapBasicToStableGasLimit(this.toEthersBigNumber(this.adjustmentValueBasic), this.stableAmountOut);

		this.gasLimitEth = this.gasLimitBuffer(this.gasLimitEth);
		this.gasLimitBsc = this.gasLimitBuffer(this.gasLimitBsc);


		// gasPrice for BSC legacy transactions
		// getFeeData()).maxFeePerGas for ETH EIP-1559
		let feeDataBsc = (await this._arbitrageContractBsc.provider.getFeeData());
		this.gasPriceBsc = feeDataBsc.gasPrice;

		let feeDataEth = (await this._arbitrageContractEth.provider.getFeeData());
		this.gasPriceEth = feeDataEth.gasPrice;

		let wethPrice = await this._oracleContractEth.getWrappedPrice();
		let wbnbPrice = await this._oracleContractBsc.getWrappedPrice();

		let totalFeeBsc = this.fromEthersToBigNumber(feeDataBsc.gasPrice.mul(this.gasLimitBsc)).multipliedBy(wbnbPrice);
		let totalFeeEth = this.fromEthersToBigNumber(feeDataEth.maxFeePerGas.mul(this.gasLimitEth)).multipliedBy(wethPrice);

		let transactionFees = totalFeeBsc.plus(totalFeeEth);

		// convert stable to usd in case stable token is not usd
		let stableUsdOut = this.convertStableToUsdEth(this.fromEthersToBigNumber(this.stableAmountOut));
		let swapProfit = stableUsdOut.minus(transactionFees);

		logger.info(`Maximum sum of transaction fees: ${transactionFees} USD`);
		logger.info(`Worst case profit after slippage: ${swapProfit} USD`);

		return swapProfit;
	}

	decimalShift(rawBigNumber){
		// Shift decimal separator to the right until no more decimal values are left
		// since ethers.BigNumber values require as input numbers without decimal places
		let power = 10**2;
		let rawSplitString = rawBigNumber.toString().split(".");
		if (rawSplitString.length>1){
			power *= 10**rawSplitString[1].length;
		}
		return power
	}

	async calculateSwapProfitBsc() {
		let basicAmountOut = await this._oracleContractEth.getsAmountOutBasic(this.toEthersBigNumber(this.adjustmentValueStable));

		let power = this.decimalShift(this.slippageEth);

		this.basicAmountOut = basicAmountOut.mul(ethers.BigNumber.from((this.slippageEth.multipliedBy(power).toString()))).div(power);

		let stableAmountOut = await this._oracleContractBsc.getsAmountOutStable(this.basicAmountOut);
		this.stableAmountOut = stableAmountOut.mul(ethers.BigNumber.from((this.slippageBsc.multipliedBy(power).toString()))).div(power);

		this.gasLimitEth = await this._arbitrageContractEth.swapStableToBasicGasLimit(this.toEthersBigNumber(this.adjustmentValueStable), this.basicAmountOut);
		this.gasLimitBsc = await this._arbitrageContractBsc.swapBasicToStableGasLimit(this.toEthersBigNumber(this.adjustmentValueBasic), this.stableAmountOut);

		this.gasLimitEth = this.gasLimitBuffer(this.gasLimitEth);
		this.gasLimitBsc = this.gasLimitBuffer(this.gasLimitBsc);

		// gasPrice for BSC legacy transactions
		// getFeeData()).maxFeePerGas for ETH EIP-1559
		let feeDataBsc = (await this._arbitrageContractBsc.provider.getFeeData());
		this.gasPriceBsc = feeDataBsc.gasPrice;

		let feeDataEth = (await this._arbitrageContractEth.provider.getFeeData());
		this.gasPriceEth = feeDataEth.gasPrice;

		let wethPrice = await this._oracleContractEth.getWrappedPrice();
		let wbnbPrice = await this._oracleContractBsc.getWrappedPrice();

		let totalFeeBsc = this.fromEthersToBigNumber(feeDataBsc.gasPrice.mul(this.gasLimitBsc)).multipliedBy(wbnbPrice);
		let totalFeeEth = this.fromEthersToBigNumber(feeDataEth.maxFeePerGas.mul(this.gasLimitEth)).multipliedBy(wethPrice);

		let transactionFees = totalFeeBsc.plus(totalFeeEth);

		// convert stable to usd in case stable token is not usd	
		let stableUsdOut = this.convertStableToUsdBsc(this.fromEthersToBigNumber(this.stableAmountOut));
		let swapProfit = stableUsdOut.minus(transactionFees);

		logger.info(`Maximum sum of transaction fees: ${transactionFees} USD`);
		logger.info(`Worst case profit after slippage: ${swapProfit} USD`);

		return swapProfit;
	}

	async getAdjustmentValueUsdWithFees(basicCheap, stableCheap, basicExpensive, stableExpensive, feesExpansive, feesCheap) {
		let adjustmentValue = await equationSolver.solveAdjustmentValue(basicCheap.toString(), stableCheap.toString(), basicExpensive.toString(), stableExpensive.toString(), feesExpansive.toString(), feesCheap.toString());

		return new BigNumber(adjustmentValue);
	}

	amountOut(fees, input, inputReserve, outputReserve) {
		let amountInWithFees = input.multipliedBy(fees.multipliedBy(this.decimalShift(fees)));
		let numerator = amountInWithFees.multipliedBy(outputReserve);
		let denominator = inputReserve.multipliedBy(this.decimalShift(inputReserve)).plus(amountInWithFees);

		return numerator.dividedBy(denominator);
	}
	
	amountIn(fees, output, inputReserve, outputReserve) {
		let power = this.decimalShift(fees)
		let amountOutWithFees = output.multipliedBy(fees.multipliedBy(power));
		let numerator = output.multipliedBy(inputReserve);
		let denominator = outputReserve.multipliedBy(fees.multipliedBy(power)).minus(amountOutWithFees);
		return (numerator.dividedBy(denominator)).multipliedBy(1000);
	}

	convertStableToUsdBsc(stable) {
		// Convert stable reserves to usd prices for adjustment value
		// leave it as usd, if it's already usd
		if (this._oracleContractBsc.stableTokenAddress.toLowerCase() !== constants["HUSD_BSC_TESTNET"].toLowerCase()
			&& this._oracleContractBsc.stableTokenAddress.toLowerCase() !== constants["USD_TOKEN_ADDRESS_BSC"].toLowerCase()) {
			stable = stable.multipliedBy(this.usdExchangeRateBsc);
		}

		return stable;
	}

	convertStableToUsdEth(stable) {
		// Convert stable reserves to usd prices for adjustment value
		// leave it as usd, if it's already usd
		if (this._oracleContractEth.stableTokenAddress.toLowerCase() !== constants["HUSD_ETH_TESTNET"].toLowerCase()
			&& this._oracleContractEth.stableTokenAddress.toLowerCase() !== constants["USD_TOKEN_ADDRESS_ETH"].toLowerCase()) {
			stable = stable.multipliedBy(this.usdExchangeRateEth);
		}

		return stable;
	}

	convertUsdToStableBsc(stableUsd) {
		// Convert stable reserves to usd prices for adjustment value
		// leave it as usd, if it's already usd
		if (this._oracleContractEth.stableTokenAddress.toLowerCase() !== constants["HUSD_ETH_TESTNET"].toLowerCase()
			&& this._oracleContractEth.stableTokenAddress.toLowerCase() !== constants["USD_TOKEN_ADDRESS_ETH"].toLowerCase()) {
			stableUsd = stableUsd.dividedBy(this.usdExchangeRateBsc);
		}

		return stableUsd;
	}

	convertUsdToStableEth(stableUsd) {
		// Convert stable reserves to usd prices for adjustment value
		// leave it as usd, if it's already usd
		if (this._oracleContractEth.stableTokenAddress.toLowerCase() !== constants["HUSD_ETH_TESTNET"].toLowerCase()
			&& this._oracleContractEth.stableTokenAddress.toLowerCase() !== constants["USD_TOKEN_ADDRESS_ETH"].toLowerCase()) {
			stableUsd = stableUsd.dividedBy(this.usdExchangeRateEth);
		}

		return stableUsd;
	}

	async getUsdExchangeRates() {
		this.usdExchangeRateBsc = await this._oracleContractBsc.getStableUsdPrice();
		this.usdExchangeRateEth = await this._oracleContractEth.getStableUsdPrice();
	}

	async getPoolPrices() {
		this.poolPriceBsc = await this._oracleContractBsc.getPrice();
		this.poolPriceEth = await this._oracleContractEth.getPrice();
	}

	async getReserves() {
		this.tokenArrayBsc = await this._oracleContractBsc.getReserves(); //tokenArrayBsc[0] = stableBsc, tokenArrayBsc[1] = basicBsc
		this.tokenArrayEth = await this._oracleContractEth.getReserves(); //tokenArrayEth[0] = stableEth, tokenArrayEth[1] = basicEth
	}

	async getArbitrageBalances() {
		let ethBasicBalance = await this._arbitrageContractEth.getBasicBalance();
		let ethStableBalance = await this._arbitrageContractEth.getStableBalance();

		this.ethArbitrageBalance = { basic: ethBasicBalance, stable: ethStableBalance };

		let bscBasicBalance = await this._arbitrageContractBsc.getBasicBalance();
		let bscStableBalance = await this._arbitrageContractBsc.getStableBalance();

		this.bscArbitrageBalance = { basic: bscBasicBalance, stable: bscStableBalance };
	}

	gasLimitBuffer(gasLimit) {
		gasLimit = this.fromEthersToBigNumber(gasLimit);
		gasLimit = gasLimit.multipliedBy(1.3);

		let x = new BigNumber(10).pow(18);
		return ethers.BigNumber.from(gasLimit.multipliedBy(x).dp(0).toString());
	}

	toEthersBigNumber(value) {
		let x = new BigNumber(10).pow(18);
		return ethers.BigNumber.from(value.multipliedBy(x).dp(0).toString());
	}

	fromEthersToBigNumber(value) {
		return new BigNumber(ethers.utils.formatEther(value));
	}

	setMaxSwapAmount(fees, stableReserve, basicReserve, stableTokenName, basicTokenName) {
		let maxSwapAmountIsLessThanAdjustmentValue = false;

		if(this.switchMaxSwapAmount && this.maxSwapAmountStable !== null && this.maxSwapAmountBasic !== null){

			let stableMaxSwapAmountAsBasic = this.amountOut(fees, this.maxSwapAmountStable, stableReserve, basicReserve);
			let basicMaxSwapAmountAsStable = this.amountIn(fees, this.maxSwapAmountBasic, stableReserve, basicReserve);

			if(!this.maxSwapAmountStable.isEqualTo(0) && this.maxSwapAmountBasic.isEqualTo(0)) {
				if(this.maxSwapAmountStable.lt(this.adjustmentValueStable)) {
					this.setAdjustmentValuesToMaxValues(this.maxSwapAmountStable, stableMaxSwapAmountAsBasic, stableTokenName, basicTokenName);
				}
				else {
					maxSwapAmountIsLessThanAdjustmentValue = true;
				}
			}

			else if(this.maxSwapAmountStable.isEqualTo(0) && !this.maxSwapAmountBasic.isEqualTo(0)){
				if(this.maxSwapAmountBasic.lt(this.adjustmentValueBasic)) {
					this.setAdjustmentValuesToMaxValues(basicMaxSwapAmountAsStable, this.maxSwapAmountBasic, stableTokenName, basicTokenName);
				}
				else {
					maxSwapAmountIsLessThanAdjustmentValue = true;
				}
			}

			else if(!this.maxSwapAmountStable.isEqualTo(0) && !this.maxSwapAmountBasic.isEqualTo(0)){
				if(stableMaxSwapAmountAsBasic.lt(this.maxSwapAmountBasic) && this.maxSwapAmountStable.lt(this.adjustmentValueStable)) {
					this.setAdjustmentValuesToMaxValues(this.maxSwapAmountStable, stableMaxSwapAmountAsBasic, stableTokenName, basicTokenName);
	
					logger.info("Swap will be executed based on max adjustment value stable");		
				}
	
				else if(stableMaxSwapAmountAsBasic.gt(this.maxSwapAmountBasic) && this.maxSwapAmountBasic.lt(this.adjustmentValueBasic)) {		
					this.setAdjustmentValuesToMaxValues(basicMaxSwapAmountAsStable, this.maxSwapAmountBasic, stableTokenName, basicTokenName);

					logger.info("Swap will be executed based on max adjustment value basic.");
				}

				else {
					maxSwapAmountIsLessThanAdjustmentValue = true;
				}
			}
			else {
				logger.info("Both values for the maximum swap amount are 0 or not set. The adjustment values remain the same.");
			}
		}

		if(maxSwapAmountIsLessThanAdjustmentValue) {
			logger.info("Max swap amount is bigger than the current adjustment value. The adjustment values remain the same.");
		}
	}

	setAdjustmentValuesToMaxValues(maxSwapAmountStable, maxSwapAmountBasic, stableTokenName, basicTokenName) {
		this.adjustmentValueStable = maxSwapAmountStable;
		this.adjustmentValueBasic = maxSwapAmountBasic;

		logger.info(`New Adjustment value stable: ${this.adjustmentValueStable.toString()} ${stableTokenName}`);
		logger.info(`New Adjustment value basic: ${this.adjustmentValueBasic.toString()} ${basicTokenName}`);	
	}
}

module.exports = new ArbitrageService();