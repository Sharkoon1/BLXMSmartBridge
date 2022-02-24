import { TokenAddress } from "../container/tokenAddress";
import { NetworkData } from "../container/networkData";
import { ArbitrageContractContainer } from "../container/arbitrageContractContainer";
import { ArbitrageContractBalance } from "../container/arbitrageContractBalance";
import { PoolReserve } from "../container/poolReserve";
import { ArbitrageTokenName } from "../container/arbitrageTokenNames";
import { ArbitrageContract } from "../contracts/ArbitrageContract";
import { OracleContract } from "../contracts/OracleContract";
import { NetworkDataBuilder } from "../builder/networkDataBuilder";
import { constants } from "../constants/constants";
import BigNumber from "bignumber.js";
import { compareUpTo, bigNumberToFloat } from "../helpers/utility"
import { logger } from "../logger/logger";

class ArbitrageFactory {
    oracleContractEth: OracleContract
    oracleContractBsc: OracleContract
    private isInitialized:boolean
    private readonly PRICE_DECIMAL_COMPARE_VALUE;

    constructor() {
        this.isInitialized = false;
    }

    /**
     * Creates an ArbitrageContractContainer, which contains the cheap and expensive network data to make arbitrage.
     * @returns { Promise<ArbitrageContractContainer> }
     */
    async create() : Promise<ArbitrageContractContainer> {
        if(!this.isInitialized) {
            await this.init();
        }

        let expensiveNetworkName:string = await this.getExpensiveNetwork();
        let cheapNetworkName :string = await this.getExpensiveNetwork();

        let cheapOracleContract: OracleContract = this.getOracleContractByNetworkName(cheapNetworkName);
        let expensiveOracleContract: OracleContract = this.getOracleContractByNetworkName(expensiveNetworkName);

        let cheapNetworkData:NetworkData;
        let expensiveNetworkData:NetworkData;

        switch(expensiveNetworkName) {
            case constants.BSC_NETWORK_NAME:            
                cheapNetworkData = await this.createNetworkData(cheapNetworkName, cheapOracleContract);
                expensiveNetworkData = await this.createNetworkData(expensiveNetworkName, expensiveOracleContract);

                return new ArbitrageContractContainer(cheapNetworkData, expensiveNetworkData);
            case constants.ETH_NETWORK_NAME:
                cheapNetworkData = await this.createNetworkData(expensiveNetworkName, cheapOracleContract);
                expensiveNetworkData = await this.createNetworkData(expensiveNetworkName, expensiveOracleContract);

                return new ArbitrageContractContainer(cheapNetworkData, expensiveNetworkData);
        }
    }

    /**
     * Validates if an arbitrage possibility exists
     * @returns { Promise<boolean> }
     */
    async canCreateArbitrage() : Promise<boolean> {
        if(!this.isInitialized) {
            await this.init();
        }

        let poolPriceBsc:BigNumber = this.oracleContractBsc.getPrice();
        let poolPriceEth:BigNumber = this.oracleContractEth.getPrice();    

        let pricesAreEqual:boolean =  this.pricesAreEqual(poolPriceBsc, poolPriceEth);

        if(pricesAreEqual) {
            logger.info("Price difference found");
        }
        else {
            logger.info("Prices are currently equal");
        }

        logger.info(`ETH network: Current price = ${poolPriceEth} USD/BLXM`);
        logger.info(`BSC network: Current price = ${poolPriceBsc} USD/BLXM`);

        return pricesAreEqual;
    }

    private pricesAreEqual(priceA:BigNumber, priceB:BigNumber) : boolean {
        return compareUpTo(bigNumberToFloat(priceA), bigNumberToFloat(priceB), this.PRICE_DECIMAL_COMPARE_VALUE);
    }

    private async getExpensiveNetwork() : Promise<string> {
        let poolPriceBsc:BigNumber = this.oracleContractBsc.getPrice();
        let poolPriceEth:BigNumber = this.oracleContractEth.getPrice();   

        return poolPriceBsc.gt(poolPriceEth) ? constants.BSC_NETWORK_NAME : constants.ETH_NETWORK_NAME;
    }

    private getOracleContractByNetworkName(networkName:string) : OracleContract {
        return networkName === constants.BSC_NETWORK_NAME ? this.oracleContractBsc : this.oracleContractEth;
    }   

    private async createNetworkData(networkName:string, oracleContract:OracleContract) : Promise<NetworkData> {
        let arbitrageContract:ArbitrageContract = new ArbitrageContract(networkName);

        let reserveOracleResult = await oracleContract.getReserves(); 

        let poolReserve:PoolReserve = new PoolReserve(reserveOracleResult[0], reserveOracleResult[1]);

        let balance = await arbitrageContract.getBalances();

        let arbitrageContractBalance: ArbitrageContractBalance = new ArbitrageContractBalance(balance.stableBalance, balance.basicBalance);
    
        let basicName:string = await arbitrageContract.getBasicName();
        let stableName:string = await arbitrageContract.getStableName();

        let arbitrageTokenName: ArbitrageTokenName = new ArbitrageTokenName(stableName, basicName);

        let networkData:NetworkData = new NetworkDataBuilder().withArbitrageContract(arbitrageContract)
                                                            .withOracleContract(oracleContract)
                                                            .withArbitrageContractBalance(arbitrageContractBalance)
                                                            .withPoolReserve(poolReserve)
                                                            .withTokenName(arbitrageTokenName)
                                                            .build();

        return networkData;
    }

    async init() {
        let arbitrageContractEth = new ArbitrageContract("ETH");
        let arbitrageContractBsc = new ArbitrageContract("BSC");

        let basicTokenAddressEth = await arbitrageContractEth.getBasicAddress();
        let stableTokenAddressEth = await arbitrageContractEth.getStableAddress();

        this.oracleContractEth = new OracleContract(basicTokenAddressEth, stableTokenAddressEth);

        let basicTokenAddressBsc = await arbitrageContractBsc.getBasicAddress();
        let stableTokenAddressBsc = await arbitrageContractBsc.getStableAddress();

        this.oracleContractBsc = new OracleContract(basicTokenAddressBsc, stableTokenAddressBsc);

        this.isInitialized = true;
    }
}

export { ArbitrageFactory };