"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjustmentValueService = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const adjustmentValue_1 = require("../container/adjustmentValue");
const equationSolver_1 = require("../math/equationSolver");
const conversionService_1 = require("./conversionService");
const logger_1 = require("../logger/logger");
class AdjustmentValueService {
    calculateAdjustmentValues(cheapNetworkData, expensiveNetworkData) {
        return __awaiter(this, void 0, void 0, function* () {
            let expensiveConversionService = new conversionService_1.ConversionService(expensiveNetworkData.oracleContract);
            let cheapConversionService = new conversionService_1.ConversionService(cheapNetworkData.oracleContract);
            let stableUsdCheap = cheapConversionService.convertStableToUsd(cheapNetworkData.poolReserve.stable, cheapNetworkData.usdConversionRate);
            let stableUsdExpensive = expensiveConversionService.convertStableToUsd(cheapNetworkData.poolReserve.stable, expensiveNetworkData.usdConversionRate);
            let basicCheapAsString = cheapNetworkData.poolReserve.basic.toString();
            let stableCheapAsString = stableUsdCheap.toString();
            let basicExpensiveAsString = expensiveNetworkData.poolReserve.basic.toString();
            let stableExpensiveAsString = stableUsdExpensive.toString();
            let expansivePoolFee = expensiveNetworkData.poolFee.toString();
            let cheapPoolFee = cheapNetworkData.poolFee.toString();
            let adjustmentValueStableUsd = new bignumber_js_1.default(yield equationSolver_1.equationSolver.solveAdjustmentValue(basicCheapAsString, stableCheapAsString, basicExpensiveAsString, stableExpensiveAsString, expansivePoolFee, cheapPoolFee));
            let adjustmentValueStable = cheapConversionService.convertUsdToStable(adjustmentValueStableUsd, cheapNetworkData.usdConversionRate);
            let adjustmentValueBasic = this.amountOut(cheapNetworkData.poolFee, adjustmentValueStable, cheapNetworkData.poolReserve.stable, cheapNetworkData.poolReserve.basic);
            logger_1.logger.info(`Adjustment Value stable: ${adjustmentValueStable} ${cheapNetworkData.tokenNames.stableTokenName}`);
            logger_1.logger.info(`Adjustment Value basic: ${adjustmentValueBasic}  ${expensiveNetworkData.tokenNames.basicTokenName}`);
            return new adjustmentValue_1.AdjustmentValue(adjustmentValueStable, adjustmentValueBasic);
        });
    }
    amountOut(fees, input, inputReserve, outputReserve) {
        let amountInWithFees = input.multipliedBy(fees.multipliedBy(1000));
        let numerator = amountInWithFees.multipliedBy(outputReserve);
        let denominator = inputReserve.multipliedBy(1000).plus(amountInWithFees);
        return numerator.dividedBy(denominator);
    }
    amountIn(fees, output, inputReserve, outputReserve) {
        let amountOutWithFees = output.multipliedBy(fees.multipliedBy(1000));
        let numerator = output.multipliedBy(inputReserve);
        let denominator = outputReserve.multipliedBy(fees.multipliedBy(1000)).minus(amountOutWithFees);
        return (numerator.dividedBy(denominator)).multipliedBy(1000);
    }
}
exports.AdjustmentValueService = AdjustmentValueService;
//# sourceMappingURL=adjustmentValueService.js.map