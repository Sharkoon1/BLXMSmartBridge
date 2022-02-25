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
const OracleContract_1 = require("../contracts/OracleContract");
const constants_1 = require("../constants/constants");
const arbitrageFactory_1 = require("../factory/arbitrageFactory");
const logger_1 = require("../logger/logger");
class ArbitrageService {
    constructor() {
        this.ethOracleContract = new OracleContract_1.OracleContract(constants_1.constants.ETH_NETWORK_NAME);
        this.bscOracleContract = new OracleContract_1.OracleContract(constants_1.constants.BSC_NETWORK_NAME);
        this.arbitrageFactory = new arbitrageFactory_1.ArbitrageFactory();
    }
    startArbitrage() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info("Starting the abitrage service ...");
            let arbitrageContractContainer;
            if (this.arbitrageFactory.canCreateArbitrage()) {
                arbitrageContractContainer = yield this.arbitrageFactory.create();
            }
            else {
                logger_1.logger.info("Skipping current arbitrage cycle.");
            }
        });
    }
    executeSwaps() {
    }
    stopArbitrage() {
    }
}
exports.ArbitrageService = ArbitrageService;
//# sourceMappingURL=arbitrageServiceV2.js.map