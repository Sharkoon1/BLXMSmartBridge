import { AbstractArbitrageService } from "../abstraction/abstractArbitrageService";
import { OracleContract } from "../contracts/OracleContract";
import { constants } from "../constants/constants";
import { ArbitrageContractContainer } from "../container/arbitrageContractContainer";
import { ArbitrageFactory } from "../factory/arbitrageFactory";
import { logger } from "../logger/logger";
import { AdjustmentValueService } from "./adjustmentValueService";
import { AdjustmentValue } from "../container/adjustmentValue";

class ArbitrageService implements AbstractArbitrageService {
    arbitrageFactory:ArbitrageFactory;
    constructor() {
      this.arbitrageFactory = new ArbitrageFactory();
    }

    async startArbitrageCycle() {
			logger.info("Starting the abitrage service ...");

      let arbitrageContractContainer:ArbitrageContractContainer;

      if(this.arbitrageFactory.canCreateArbitrage()) {
        arbitrageContractContainer = await this.arbitrageFactory.create();
      }

      else {
        logger.info("Skipping current arbitrage cycle.");
      }

      let adjustmentValueService:AdjustmentValueService = new AdjustmentValueService();

      let adjustmentValues:AdjustmentValue = await adjustmentValueService.calculateAdjustmentValues(arbitrageContractContainer.cheapNetworkData, arbitrageContractContainer.expensiveNetworkData);
    }

    executeSwaps() {
        
    }

    stopArbitrage() {
        
    }
}
   

  export { ArbitrageService };