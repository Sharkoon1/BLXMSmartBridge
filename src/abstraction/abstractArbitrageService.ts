import { AdjustmentValues } from "../container/adjustmentValues";
import { ArbitrageContractContainer } from "../container/arbitrageContractContainer";

export interface AbstractArbitrageService {
    startArbitrage();
    stopArbitrage();
    executeSwaps(arbitrageContractContainer: ArbitrageContractContainer, adjustmentValues: AdjustmentValues);
}