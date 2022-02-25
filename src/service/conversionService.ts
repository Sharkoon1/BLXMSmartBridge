import { AbstractConversionService } from "../abstraction/abstractConversionService";
import { OracleContract } from "../contracts/OracleContract";
import { constants } from "../constants/constants";
import BigNumber from "bignumber.js";

class ConversionService implements AbstractConversionService{
    private _oracleContract: OracleContract;

    constructor(oracleContract: OracleContract) {
        this._oracleContract = oracleContract;
    }

    convertStableToUsd(stable:BigNumber, usdConversionRate:BigNumber) : BigNumber{
        if (!this.stableIsUsd()) {
            stable = stable.multipliedBy(usdConversionRate);
        }

        return stable;
    }

    convertUsdToStable(stableUsd:BigNumber, usdConversionRate:BigNumber) : BigNumber {
		if (!this.stableIsUsd()) {
			stableUsd = stableUsd.dividedBy(usdConversionRate);
		}

		return stableUsd;
    }

    private stableIsUsd() : boolean {
        return this._oracleContract.stableTokenAddress.toLowerCase() === constants[`HUSD_${this._oracleContract.network}_TESTNET`].toLowerCase()
        && this._oracleContract.stableTokenAddress.toLowerCase() === constants[`USD_TOKEN_ADDRESS_${this._oracleContract.network}`].toLowerCase();
    }
}

export { ConversionService };