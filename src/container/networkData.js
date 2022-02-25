"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkData = void 0;
class NetworkData {
    constructor(builder) {
        if (builder.arbitrageContract)
            throw new TypeError("arbitrageContract not defined");
        if (builder.oracleContract)
            throw new TypeError("oracleContract not defined");
        if (builder.arbitrageContractBalance)
            throw new TypeError("arbitrageContractBalance not defined");
        if (builder.poolReserve)
            throw new TypeError("poolReserve not defined");
        if (builder.tokenNames)
            throw new TypeError("tokenNames not defined");
        if (builder.poolFee)
            throw new TypeError("poolFee not defined");
        if (builder.usdConversionRate)
            throw new TypeError("usdConversionRate not defined");
        this.usdConversionRate = builder.usdConversionRate;
        this.poolFee = builder.poolFee;
        this.arbitrageContract = builder.arbitrageContract;
        this.oracleContract = builder.oracleContract;
        this.arbitrageContractBalance = builder.arbitrageContractBalance;
        this.poolReserve = builder.poolReserve;
        this.tokenNames = builder.tokenNames;
    }
}
exports.NetworkData = NetworkData;
//# sourceMappingURL=networkData.js.map