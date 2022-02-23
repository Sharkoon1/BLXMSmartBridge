import { ArbitrageContract } from "../contracts/ArbitrageContract";
import { OracleContract } from "../contracts/OracleContract";
import { PoolReserve } from "./poolReserve";
import { ArbitrageContractBalance } from "./arbitrageContractBalance";
import { ArbitrageTokenName } from "./arbitrageTokenNames";

class NetworkData {
    arbitrageContract:ArbitrageContract;
    oracleContract:OracleContract;
    
    arbitrageContractBalance:ArbitrageContractBalance;

    poolReserve:PoolReserve;
  
    tokenNames:ArbitrageTokenName;

    constructor(arbitrageContract: ArbitrageContract, oracleContract: OracleContract, arbitrageContractBalance: ArbitrageContractBalance, poolReserve:PoolReserve, tokenNames:ArbitrageTokenName) {
        this.arbitrageContract = arbitrageContract;
        this.oracleContract = oracleContract;
        this.arbitrageContractBalance = arbitrageContractBalance;
        this.arbitrageContractBalance = arbitrageContractBalance;
        this.poolReserve = poolReserve;
        this.tokenNames = tokenNames;
    }
}

export { NetworkData };