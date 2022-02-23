import { ArbitrageContract } from "../contracts/ArbitrageContract";
import { OracleContract } from "../contracts/OracleContract";
import { PoolReserve } from "../container/poolReserve";
import { ArbitrageContractBalance } from "../container/arbitrageContractBalance";
import { ArbitrageTokenName } from "../container/arbitrageTokenNames";
import { NetworkData } from "../container/networkData";

class NetworkDataBuilder {
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

    withPoolReserve(poolReserve:PoolReserve) {
        this.poolReserve = poolReserve;
        return this;
    }

    withTokenName(tokenNames:ArbitrageTokenName) {
        this.tokenNames = tokenNames;
        return this;
    }

    build() : NetworkData {
        return new NetworkData(this);
    }

}

export { NetworkDataBuilder };