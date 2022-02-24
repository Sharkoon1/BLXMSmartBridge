import { AdjustmentValue } from "../container/adjustmentValue";
import { ArbitrageContractContainer } from "../container/arbitrageContractContainer";

export interface AbstractArbitrageService {
    startArbitrage();
    stopArbitrage();
    executeSwaps(arbitrageContractContainer: ArbitrageContractContainer, adjustmentValues: AdjustmentValue);
}