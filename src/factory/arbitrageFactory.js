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
exports.ArbitrageFactory = void 0;
const arbitrageContractContainer_1 = require("../container/arbitrageContractContainer");
const arbitrageContractBalance_1 = require("../container/arbitrageContractBalance");
const poolReserve_1 = require("../container/poolReserve");
const arbitrageTokenNames_1 = require("../container/arbitrageTokenNames");
const ArbitrageContract_1 = require("../contracts/ArbitrageContract");
const OracleContract_1 = require("../contracts/OracleContract");
const networkDataBuilder_1 = require("../builder/networkDataBuilder");
const constants_1 = require("../constants/constants");
const utility_1 = require("../helpers/utility");
const logger_1 = require("../logger/logger");
class ArbitrageFactory {
    constructor() {
        this.isInitialized = false;
    }
    /**
     * Creates an ArbitrageContractContainer, which contains the cheap and expensive network data to make arbitrage.
     * @returns { Promise<ArbitrageContractContainer> }
     */
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isInitialized) {
                yield this.init();
            }
            let expensiveNetworkName = yield this.getExpensiveNetwork();
            let cheapNetworkName = yield this.getExpensiveNetwork();
            let cheapOracleContract = this.getOracleContractByNetworkName(cheapNetworkName);
            let expensiveOracleContract = this.getOracleContractByNetworkName(expensiveNetworkName);
            let cheapNetworkData;
            let expensiveNetworkData;
            switch (expensiveNetworkName) {
                case constants_1.constants.BSC_NETWORK_NAME:
                    cheapNetworkData = yield this.createNetworkData(cheapNetworkName, cheapOracleContract);
                    expensiveNetworkData = yield this.createNetworkData(expensiveNetworkName, expensiveOracleContract);
                    return new arbitrageContractContainer_1.ArbitrageContractContainer(cheapNetworkData, expensiveNetworkData);
                case constants_1.constants.ETH_NETWORK_NAME:
                    cheapNetworkData = yield this.createNetworkData(expensiveNetworkName, cheapOracleContract);
                    expensiveNetworkData = yield this.createNetworkData(expensiveNetworkName, expensiveOracleContract);
                    return new arbitrageContractContainer_1.ArbitrageContractContainer(cheapNetworkData, expensiveNetworkData);
            }
        });
    }
    /**
     * Validates if an arbitrage possibility exists
     * @returns { Promise<boolean> }
     */
    canCreateArbitrage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isInitialized) {
                yield this.init();
            }
            let poolPriceBsc = this.oracleContractBsc.getPrice();
            let poolPriceEth = this.oracleContractEth.getPrice();
            let pricesAreEqual = this.pricesAreEqual(poolPriceBsc, poolPriceEth);
            if (pricesAreEqual) {
                logger_1.logger.info("Price difference found");
            }
            else {
                logger_1.logger.info("Prices are currently equal");
            }
            logger_1.logger.info(`ETH network: Current price = ${poolPriceEth} USD/BLXM`);
            logger_1.logger.info(`BSC network: Current price = ${poolPriceBsc} USD/BLXM`);
            return pricesAreEqual;
        });
    }
    pricesAreEqual(priceA, priceB) {
        return (0, utility_1.compareUpTo)((0, utility_1.bigNumberToFloat)(priceA), (0, utility_1.bigNumberToFloat)(priceB), this.PRICE_DECIMAL_COMPARE_VALUE);
    }
    getExpensiveNetwork() {
        return __awaiter(this, void 0, void 0, function* () {
            let poolPriceBsc = this.oracleContractBsc.getPrice();
            let poolPriceEth = this.oracleContractEth.getPrice();
            return poolPriceBsc.gt(poolPriceEth) ? constants_1.constants.BSC_NETWORK_NAME : constants_1.constants.ETH_NETWORK_NAME;
        });
    }
    getOracleContractByNetworkName(networkName) {
        return networkName === constants_1.constants.BSC_NETWORK_NAME ? this.oracleContractBsc : this.oracleContractEth;
    }
    getNetworkPoolFee(networkName) {
        if (process.env.NODE_ENV === "production") {
            return networkName === constants_1.constants.BSC_NETWORK_NAME ? constants_1.constants.PANCAKESWAP_FEES : constants_1.constants.UNISWAP_FEES;
        }
        else {
            return networkName === constants_1.constants.BSC_NETWORK_NAME ? constants_1.constants.PANCAKESWAP_FEES_TESTNET : constants_1.constants.UNISWAP_FEES_TESTNET;
        }
    }
    createNetworkData(networkName, oracleContract) {
        return __awaiter(this, void 0, void 0, function* () {
            let arbitrageContract = new ArbitrageContract_1.ArbitrageContract(networkName);
            let reserveOracleResult = yield oracleContract.getReserves();
            let poolReserve = new poolReserve_1.PoolReserve(reserveOracleResult[0], reserveOracleResult[1]);
            let balance = yield arbitrageContract.getBalances();
            let arbitrageContractBalance = new arbitrageContractBalance_1.ArbitrageContractBalance(balance.stableBalance, balance.basicBalance);
            let basicName = yield arbitrageContract.getBasicName();
            let stableName = yield arbitrageContract.getStableName();
            let arbitrageTokenName = new arbitrageTokenNames_1.ArbitrageTokenName(stableName, basicName);
            let poolFee = this.getNetworkPoolFee(networkName);
            let usdConversionRate = yield oracleContract.getStableUsdPrice();
            let networkData = new networkDataBuilder_1.NetworkDataBuilder().withArbitrageContract(arbitrageContract)
                .withOracleContract(oracleContract)
                .withArbitrageContractBalance(arbitrageContractBalance)
                .withPoolReserve(poolReserve)
                .withTokenName(arbitrageTokenName)
                .withPoolFee(poolFee)
                .withUsdConversionRate(usdConversionRate)
                .build();
            return networkData;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let arbitrageContractEth = new ArbitrageContract_1.ArbitrageContract("ETH");
            let arbitrageContractBsc = new ArbitrageContract_1.ArbitrageContract("BSC");
            let basicTokenAddressEth = yield arbitrageContractEth.getBasicAddress();
            let stableTokenAddressEth = yield arbitrageContractEth.getStableAddress();
            this.oracleContractEth = new OracleContract_1.OracleContract(basicTokenAddressEth, stableTokenAddressEth);
            let basicTokenAddressBsc = yield arbitrageContractBsc.getBasicAddress();
            let stableTokenAddressBsc = yield arbitrageContractBsc.getStableAddress();
            this.oracleContractBsc = new OracleContract_1.OracleContract(basicTokenAddressBsc, stableTokenAddressBsc);
            this.isInitialized = true;
        });
    }
}
exports.ArbitrageFactory = ArbitrageFactory;
//# sourceMappingURL=arbitrageFactory.js.map