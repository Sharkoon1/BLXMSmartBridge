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
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const equationSolver_1 = require("../math/equationSolver");
class AdjustmentValueService {
    calculateAdjustmentValues(cheapNetworkData, expensiveNetworkData) {
        return __awaiter(this, void 0, void 0, function* () {
            let stableBsc = this.convertStableToUsdBsc(stableCheap);
            let stableEth = this.convertStableToUsdEth(stableExpensive);
            let basicCheapAsString = cheapNetworkData.poolReserve.basic.toString();
            let stableCheapAsString = cheapNetworkData.poolReserve.stable.toString();
            let basicExpensiveAsString = expensiveNetworkData.poolReserve.basic.toString();
            let stableExpensiveAsString = expensiveNetworkData.poolReserve.stable.toString();
            let expansivePoolFee = expensiveNetworkData.poolFee.toString();
            let cheapPoolFee = cheapNetworkData.poolFee.toString();
            let adjustmentValueStable = new bignumber_js_1.default(yield equationSolver_1.equationSolver.solveAdjustmentValue(basicCheapAsString, stableCheapAsString, basicExpensiveAsString, stableExpensiveAsString, expansivePoolFee, cheapPoolFee));
        });
    }
}
//# sourceMappingURL=adjustmentValueService.js.map