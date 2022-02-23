import { TokenAddress } from "../container/tokenAddress";
import { NetworkData } from "../container/networkData";
import { ArbitrageContractContainer } from "../container/arbitrageContractContainer";
import { ArbitrageContractBalance } from "../container/arbitrageContractBalance";
import { PoolReserve } from "../container/poolReserve";
import { ArbitrageTokenName } from "../container/arbitrageTokenNames";
import { ArbitrageContract } from "../contracts/ArbitrageContract";
import { OracleContract } from "../contracts/OracleContract";
import { NetworkDataBuilder } from "../builder/networkDataBuilder";

class ArbitrageFactory {
    tokenAddressEth: TokenAddress
    tokenAddressBsc: TokenAddress
    private isInitialized:boolean

    constructor(tokenAddressEth, tokenAddressBsc) {
        this.tokenAddressEth = tokenAddressEth;
        this.tokenAddressBsc = tokenAddressBsc;

        this.isInitialized = false;
    }

    async create(swapDestinationNetwork:string) {
        if(!this.isInitialized) {
            await this.init();
        }

        let cheapNetworkData:NetworkData;
        let expensiveNetworkData:NetworkData;

        switch(swapDestinationNetwork) {
            case "BSC":            
                cheapNetworkData = await this.createNetworkData("ETH");
                expensiveNetworkData = await this.createNetworkData("BSC");

                return new ArbitrageContractContainer(cheapNetworkData, expensiveNetworkData);
            case "ETH":
                cheapNetworkData = await this.createNetworkData("BSC");
                expensiveNetworkData = await this.createNetworkData("ETH");

                return new ArbitrageContractContainer(cheapNetworkData, expensiveNetworkData);
            default:
                return new Error("Swap destination network not supported.");
        }
    }

    private async createNetworkData(networkName:string) : Promise<NetworkData> {
        let arbitrageContract:ArbitrageContract = new ArbitrageContract(networkName);
        let oracleContract:OracleContract = new ArbitrageContract(networkName);

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

        this.tokenAddressEth = new TokenAddress(stableTokenAddressEth, basicTokenAddressEth);

        let basicTokenAddressBsc = await arbitrageContractBsc.getBasicAddress();
        let stableTokenAddressBsc = await arbitrageContractBsc.getStableAddress();

        this.tokenAddressBsc = new TokenAddress(stableTokenAddressBsc, basicTokenAddressBsc);

        this.isInitialized = true;
    }
}

module.exports = ArbitrageFactory;