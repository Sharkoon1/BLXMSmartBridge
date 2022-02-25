"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkDataBuilder = void 0;
const networkData_1 = require("../container/networkData");
class NetworkDataBuilder {
    constructor() {
        new NetworkDataBuilder();
    }
    withArbitrageContract(arbitrageContract) {
        this.arbitrageContract = arbitrageContract;
        return this;
    }
    withOracleContract(oracleContract) {
        this.oracleContract = oracleContract;
        return this;
    }
    withArbitrageContractBalance(arbitrageContractBalance) {
        this.arbitrageContractBalance = arbitrageContractBalance;
        return this;
    }
    withPoolFee(poolFee) {
        this.poolFee = poolFee;
        return this;
    }
    withPoolReserve(poolReserve) {
        this.poolReserve = poolReserve;
        return this;
    }
    withTokenName(tokenNames) {
        this.tokenNames = tokenNames;
        return this;
    }
    build() {
        return new networkData_1.NetworkData(this);
    }
}
exports.NetworkDataBuilder = NetworkDataBuilder;
//# sourceMappingURL=networkDataBuilder.js.map