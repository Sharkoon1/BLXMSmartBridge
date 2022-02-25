import { NetworkDataBuilder } from "../builder/networkDataBuilder";
import { ArbitrageContract } from "../contracts/ArbitrageContract";
import { OracleContract } from "../contracts/OracleContract";
import { PoolReserve } from "./poolReserve";
import { ArbitrageContractBalance } from "./arbitrageContractBalance";
import { ArbitrageTokenName } from "./arbitrageTokenNames";
import BigNumber from "bignumber.js";

class NetworkData {
    usdConversionRate:BigNumber;
    poolFee:BigNumber;
    arbitrageContract:ArbitrageContract;
    oracleContract:OracleContract;
    
    arbitrageContractBalance:ArbitrageContractBalance;

    poolReserve:PoolReserve;
  
    tokenNames:ArbitrageTokenName;

    constructor(builder: NetworkDataBuilder) {
        if(builder.arbitrageContract) throw new TypeError("arbitrageContract not defined");
        if(builder.oracleContract) throw new TypeError("oracleContract not defined");
        if(builder.arbitrageContractBalance) throw new TypeError("arbitrageContractBalance not defined");
        if(builder.poolReserve) throw new TypeError("poolReserve not defined");
        if(builder.tokenNames) throw new TypeError("tokenNames not defined");
        if(builder.poolFee) throw new TypeError("poolFee not defined");
        if(builder.usdConversionRate) throw new TypeError("usdConversionRate not defined");

        this.usdConversionRate = builder.usdConversionRate;
        this.poolFee = builder.poolFee;
        this.arbitrageContract = builder.arbitrageContract;
        this.oracleContract = builder.oracleContract;
        this.arbitrageContractBalance = builder.arbitrageContractBalance;
        this.poolReserve = builder.poolReserve;
        this.tokenNames = builder.tokenNames;
    }
}

export { NetworkData };