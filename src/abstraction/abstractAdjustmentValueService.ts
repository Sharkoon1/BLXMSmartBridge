import { AdjustmentValue } from "../container/adjustmentValue";
import { NetworkData } from "../container/networkData";

export interface AbstractAdjustmentValueService {
    calculateAdjustmentValues(cheapNetworkData:NetworkData, expensiveNetworkData: NetworkData) : Promise<AdjustmentValue>;
}