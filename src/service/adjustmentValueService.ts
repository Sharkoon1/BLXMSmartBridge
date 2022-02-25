import BigNumber from "bignumber.js";
import { AbstractAdjustmentValueService } from "../abstraction/abstractAdjustmentValueService";
import { AdjustmentValue } from "../container/adjustmentValue";
import { NetworkData } from "../container/networkData";
import { equationSolver } from "../math/equationSolver";
import { ConversionService } from "./conversionService";
import { logger } from "../logger/logger";

class AdjustmentValueService implements AbstractAdjustmentValueService {
    async calculateAdjustmentValues(cheapNetworkData: NetworkData, expensiveNetworkData: NetworkData): Promise<AdjustmentValue> {
        let expensiveConversionService:ConversionService = new ConversionService(expensiveNetworkData.oracleContract);
        let cheapConversionService:ConversionService = new ConversionService(cheapNetworkData.oracleContract);

        let stableUsdCheap:BigNumber = cheapConversionService.convertStableToUsd(cheapNetworkData.poolReserve.stable, cheapNetworkData.usdConversionRate);
        let stableUsdExpensive:BigNumber = expensiveConversionService.convertStableToUsd(cheapNetworkData.poolReserve.stable, expensiveNetworkData.usdConversionRate);

        let basicCheapAsString = cheapNetworkData.poolReserve.basic.toString();
        let stableCheapAsString = stableUsdCheap.toString();
        let basicExpensiveAsString = expensiveNetworkData.poolReserve.basic.toString();
        let stableExpensiveAsString = stableUsdExpensive.toString();

        let expansivePoolFee = expensiveNetworkData.poolFee.toString();
        let cheapPoolFee = cheapNetworkData.poolFee.toString();

		let adjustmentValueStableUsd:BigNumber = new BigNumber(await equationSolver.solveAdjustmentValue(basicCheapAsString, stableCheapAsString, basicExpensiveAsString, stableExpensiveAsString, expansivePoolFee, cheapPoolFee));

        let adjustmentValueStable:BigNumber =  cheapConversionService.convertUsdToStable(adjustmentValueStableUsd, cheapNetworkData.usdConversionRate);

        let adjustmentValueBasic:BigNumber = this.amountOut(cheapNetworkData.poolFee, adjustmentValueStable, cheapNetworkData.poolReserve.stable, cheapNetworkData.poolReserve.basic);

        logger.info(`Adjustment Value stable: ${adjustmentValueStable} ${cheapNetworkData.tokenNames.stableTokenName}`);
		logger.info(`Adjustment Value basic: ${adjustmentValueBasic}  ${expensiveNetworkData.tokenNames.basicTokenName}`);

        return new AdjustmentValue(adjustmentValueStable, adjustmentValueBasic);
    }

    amountOut(fees: BigNumber, input: BigNumber, inputReserve: BigNumber, outputReserve: BigNumber): BigNumber {
        let amountInWithFees = input.multipliedBy(fees.multipliedBy(1000));
		let numerator = amountInWithFees.multipliedBy(outputReserve);
		let denominator = inputReserve.multipliedBy(1000).plus(amountInWithFees);

		return numerator.dividedBy(denominator);
    }
    amountIn(fees: BigNumber, output: BigNumber, inputReserve: BigNumber, outputReserve: BigNumber): BigNumber {
        let amountOutWithFees = output.multipliedBy(fees.multipliedBy(1000));
		let numerator = output.multipliedBy(inputReserve);
		let denominator = outputReserve.multipliedBy(fees.multipliedBy(1000)).minus(amountOutWithFees);
		return (numerator.dividedBy(denominator)).multipliedBy(1000);
    }
}

export { AdjustmentValueService }