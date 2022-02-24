import { NetworkData } from "./networkData";

class ArbitrageContractContainer {
    cheapNetworkData:NetworkData;
    expensiveNetworkData:NetworkData;
    

    constructor(cheapNetworkData,  expensiveNetworkData) {
        this.cheapNetworkData = cheapNetworkData;
        this.expensiveNetworkData = expensiveNetworkData;
    }
}

export { ArbitrageContractContainer };