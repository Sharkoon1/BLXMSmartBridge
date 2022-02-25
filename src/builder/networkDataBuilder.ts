import { ArbitrageContract } from "../contracts/ArbitrageContract";
import { OracleContract } from "../contracts/OracleContract";
import { PoolReserve } from "../container/poolReserve";
import { ArbitrageContractBalance } from "../container/arbitrageContractBalance";
import { ArbitrageTokenName } from "../container/arbitrageTokenNames";
import { NetworkData } from "../container/networkData";
import BigNumber from "bignumber.js";

class NetworkDataBuilder {
    usdConversionRate:BigNumber;
    poolFee:BigNumber;
    arbitrageContract:ArbitrageContract;
    oracleContract:OracleContract;
    arbitrageContractBalance:ArbitrageContractBalance;
    poolReserve:PoolReserve;
    tokenNames:ArbitrageTokenName;

    constructor() {
        new NetworkDataBuilder();
    }

    withArbitrageContract(arbitrageContract:ArbitrageContract) {
        this.arbitrageContract = arbitrageContract;
        return this;
    }

    withOracleContract(oracleContract:OracleContract) {
        this.oracleContract = oracleContract;
        return this;
    }

    withArbitrageContractBalance(arbitrageContractBalance:ArbitrageContractBalance) {
        this.arbitrageContractBalance = arbitrageContractBalance;
        return this;
    }

    withPoolFee(poolFee:BigNumber) {
        this.poolFee = poolFee;
        return this;
    }

    withPoolReserve(poolReserve:PoolReserve) {
        this.poolReserve = poolReserve;
        return this;
    }

    withTokenName(tokenNames:ArbitrageTokenName) {
        this.tokenNames = tokenNames;
        return this;
    }

    withUsdConversionRate(usdConversionRate:BigNumber) {
        this.usdConversionRate = usdConversionRate;
        return this;
    }

    build() : NetworkData {
        return new NetworkData(this);
    }

}

export { NetworkDataBuilder };