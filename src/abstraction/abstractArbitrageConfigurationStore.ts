import BigNumber from "bignumber.js";

export interface ArbitrageConfigurationStore {
    getInstance(): ArbitrageConfigurationStore;
    setMaxSwapAmountStable(maxSwapAmountStable:BigNumber);
    setMaxSwapAmountBasic(maxSwapAmountBasic:BigNumber);
    getMaxSwapAmountStable() : BigNumber;
    getMaxSwapAmountBasic() : BigNumber;
}