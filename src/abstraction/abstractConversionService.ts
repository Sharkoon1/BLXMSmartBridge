import BigNumber from "bignumber.js";

export interface AbstractConversionService {
    convertStableToUsd(stable:BigNumber, usdConversionRate:BigNumber) : BigNumber
    convertUsdToStable(usd:BigNumber, usdConversionRate:BigNumber) : BigNumber
}