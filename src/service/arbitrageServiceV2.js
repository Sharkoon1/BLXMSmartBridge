"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArbitrageService = void 0;
const arbitrageFactory_1 = require("../factory/arbitrageFactory");
const logger_1 = require("../logger/logger");
const adjustmentValueService_1 = require("./adjustmentValueService");
class ArbitrageService {
    constructor() {
        this.arbitrageFactory = new arbitrageFactory_1.ArbitrageFactory();
    }
    startArbitrageCycle() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info("Starting the abitrage service ...");
            let arbitrageContractContainer;
            if (this.arbitrageFactory.canCreateArbitrage()) {
                arbitrageContractContainer = yield this.arbitrageFactory.create();
            }
            else {
                logger_1.logger.info("Skipping current arbitrage cycle.");
            }
            let adjustmentValueService = new adjustmentValueService_1.AdjustmentValueService();
            let adjustmentValues = yield adjustmentValueService.calculateAdjustmentValues(arbitrageContractContainer.cheapNetworkData, arbitrageContractContainer.expensiveNetworkData);
        });
    }
    executeSwaps() {
    }
    stopArbitrage() {
    }
}
exports.ArbitrageService = ArbitrageService;
//# sourceMappingURL=arbitrageServiceV2.js.map