import BigNumber from "bignumber.js";
import { AdjustmentValue } from "../container/adjustmentValue";
import { NetworkData } from "../container/networkData";

export interface AbstractAdjustmentValueService {
    calculateAdjustmentValues(cheapNetworkData:NetworkData, expensiveNetworkData: NetworkData) : Promise<AdjustmentValue>;
    amountOut(fees:BigNumber, input:BigNumber, inputReserve:BigNumber, outputReserve:BigNumber) : BigNumber
    amountIn(fees:BigNumber, output:BigNumber, inputReserve:BigNumber, outputReserve:BigNumber) : BigNumber
}