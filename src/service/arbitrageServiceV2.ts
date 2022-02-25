import { AbstractArbitrageService } from "../abstraction/abstractArbitrageService";
import { OracleContract } from "../contracts/OracleContract";
import { constants } from "../constants/constants";
import { ArbitrageContractContainer } from "../container/arbitrageContractContainer";
import { ArbitrageFactory } from "../factory/arbitrageFactory";
import { logger } from "../logger/logger";
import { AdjustmentValueService } from "./adjustmentValueService";
import { AdjustmentValue } from "../container/adjustmentValue";

class ArbitrageService implements AbstractArbitrageService {
    ethOracleContract:OracleContract;
    bscOracleContract:OracleContract;
    arbitrageFactory:ArbitrageFactory;
    constructor() {
      this.ethOracleContract = new OracleContract(constants.ETH_NETWORK_NAME);
      this.bscOracleContract = new OracleContract(constants.BSC_NETWORK_NAME);
      this.arbitrageFactory = new ArbitrageFactory();
    }

    async startArbitrage() {
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