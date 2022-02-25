import BigNumber from "bignumber.js";

/**
 * The ArbitrageConfigurationStore a unique singleton instance
 * that holds configuration values for the arbitrage service.
 */
 class ArbitrageConfigurationStore implements ArbitrageConfigurationStore {
    private static instance: ArbitrageConfigurationStore;

    private maxSwapAmountStable:BigNumber;
    private maxSwapAmountBasic :BigNumber;

    private constructor() { }

    public static getInstance(): ArbitrageConfigurationStore {
        if (!ArbitrageConfigurationStore.instance) {
            ArbitrageConfigurationStore.instance = new ArbitrageConfigurationStore();
        }

        return ArbitrageConfigurationStore.instance;
    }

    setMaxSwapAmountStable(maxSwapAmountStable:BigNumber) {
        this.maxSwapAmountStable = maxSwapAmountStable;
    }

    setMaxSwapAmountBasic(maxSwapAmountBasic:BigNumber) {
        this.maxSwapAmountBasic = maxSwapAmountBasic;
    }

    getMaxSwapAmountStable() : BigNumber {
        return this.maxSwapAmountStable;
    }

    getMaxSwapAmountBasic() : BigNumber {
        return this.maxSwapAmountBasic;
    }
}

export { ArbitrageConfigurationStore };