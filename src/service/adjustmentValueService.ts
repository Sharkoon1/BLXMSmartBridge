import BigNumber from "bignumber.js";
import { AbstractAdjustmentValueService } from "../abstraction/abstractAdjustmentValueService";
import { AdjustmentValue } from "../container/adjustmentValue";
import { NetworkData } from "../container/networkData";
import { equationSolver } from "../math/equationSolver";

class AdjustmentValueService implements AbstractAdjustmentValueService {
    async calculateAdjustmentValues(cheapNetworkData: NetworkData, expensiveNetworkData: NetworkData): Promise<AdjustmentValue> {
        let stableBsc = this.convertStableToUsdBsc(stableCheap);
		let stableEth = this.convertStableToUsdEth(stableExpensive);
        
        let basicCheapAsString = cheapNetworkData.poolReserve.basic.toString();
        let stableCheapAsString = cheapNetworkData.poolReserve.stable.toString();
        let basicExpensiveAsString = expensiveNetworkData.poolReserve.basic.toString();
        let stableExpensiveAsString = expensiveNetworkData.poolReserve.stable.toString();

        let expansivePoolFee = expensiveNetworkData.poolFee.toString();
        let cheapPoolFee = cheapNetworkData.poolFee.toString();

		let adjustmentValueStable:BigNumber = new BigNumber(await equationSolver.solveAdjustmentValue(basicCheapAsString, stableCheapAsString, basicExpensiveAsString, stableExpensiveAsString, expansivePoolFee, cheapPoolFee));
    }

}