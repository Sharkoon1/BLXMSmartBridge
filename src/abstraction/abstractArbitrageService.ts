import { AdjustmentValue } from "../container/adjustmentValue";
import { ArbitrageContractContainer } from "../container/arbitrageContractContainer";

export interface AbstractArbitrageService {
    startArbitrageCycle();
    stopArbitrage();
    executeSwaps(arbitrageContractContainer: ArbitrageContractContainer, adjustmentValues: AdjustmentValue);
}