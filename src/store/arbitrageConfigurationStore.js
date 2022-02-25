"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArbitrageConfigurationStore = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
/**
 * The ArbitrageConfigurationStore a unique singleton instance
 * that holds configuration values for the arbitrage service.
 */
class ArbitrageConfigurationStore {
    constructor() {
        this.maxSwapAmountStable = new bignumber_js_1.default(0);
        this.maxSwapAmountBasic = new bignumber_js_1.default(0);
    }
    static getInstance() {
        if (!ArbitrageConfigurationStore.instance) {
            ArbitrageConfigurationStore.instance = new ArbitrageConfigurationStore();
        }
        return ArbitrageConfigurationStore.instance;
    }
    setMaxSwapAmountStable(maxSwapAmountStable) {
        this.maxSwapAmountStable = maxSwapAmountStable;
    }
    setMaxSwapAmountBasic(maxSwapAmountBasic) {
        this.maxSwapAmountBasic = maxSwapAmountBasic;
    }
    getMaxSwapAmountStable() {
        return this.maxSwapAmountStable;
    }
    getMaxSwapAmountBasic() {
        return this.maxSwapAmountBasic;
    }
}
exports.ArbitrageConfigurationStore = ArbitrageConfigurationStore;
//# sourceMappingURL=arbitrageConfigurationStore.js.map