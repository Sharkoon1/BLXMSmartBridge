"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversionService = void 0;
const constants_1 = require("../constants/constants");
class ConversionService {
    constructor(oracleContract) {
        this._oracleContract = oracleContract;
    }
    convertStableToUsd(stable, usdConversionRate) {
        if (!this.stableIsUsd()) {
            stable = stable.multipliedBy(usdConversionRate);
        }
        return stable;
    }
    convertUsdToStable(stableUsd, usdConversionRate) {
        if (!this.stableIsUsd()) {
            stableUsd = stableUsd.dividedBy(usdConversionRate);
        }
        return stableUsd;
    }
    stableIsUsd() {
        return this._oracleContract.stableTokenAddress.toLowerCase() === constants_1.constants[`HUSD_${this._oracleContract.network}_TESTNET`].toLowerCase()
            && this._oracleContract.stableTokenAddress.toLowerCase() === constants_1.constants[`USD_TOKEN_ADDRESS_${this._oracleContract.network}`].toLowerCase();
    }
}
exports.ConversionService = ConversionService;
//# sourceMappingURL=conversionService.js.map