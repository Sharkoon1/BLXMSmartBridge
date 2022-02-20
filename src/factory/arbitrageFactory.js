const ArbitrageContractContainer = require("../container/arbitrageContractContainer");
const ArbitrageContract = require("../contracts/ArbitrageContract");
const OracleContract = require("../contracts/OracleContract");

class ArbitrageFactory {
    constructor() {
        this.basicTokenAddressEth;
        this.stableTokenAddressEth;
        this.basicTokenAddressBsc;
        this.stableTokenAddressBsc;

        this.basicTokenAddressEth;
        this.stableTokenAddressEth;
        this.basicTokenAddressBsc;
        this.stableTokenAddressBsc;

        this.isInitialized = false;
    }

    async create(swapDestinationNetwork) {
        if(!this.isInitialized) {
            await this.init();
        }

        let arbitrageContractEth = new ArbitrageContract("ETH");
        let arbitrageContractBsc = new ArbitrageContract("BSC");

        let oracleContractEth = new OracleContract("ETH", this.basicTokenAddressEth, this.stableTokenAddressEth);
        let oracleContractBsc = new OracleContract("BSC", this.basicTokenAddressBsc, this.stableTokenAddressBsc);

        let arbitrageContainer;
        let ethPoolReserves = await oracleContractEth.getReserves(); 
        let bscPoolReserves = await oracleContractBsc.getReserves(); 

        let ethBasicBalance = await arbitrageContractEth.getBalances();
		let bscBasicBalance = await arbitrageContractBsc.getBalances();

        switch(swapDestinationNetwork) {
            case "BSC":
                arbitrageContainer = new ArbitrageContractContainer(arbitrageContractEth, oracleContractEth, arbitrageContractBsc, oracleContractBsc);
            
                arbitrageContainer.setCheapArbitrageBalance(ethBasicBalance.stableBalance, ethBasicBalance.basicBalance);
                arbitrageContainer.setExpensiveArbitrageBalance(bscBasicBalance.stableBalance, bscBasicBalance.basicBalance);

                arbitrageContainer.setCheapPoolReserve(ethPoolReserves[0], ethPoolReserves[1]);
                arbitrageContainer.setExpensivePoolReserve(bscPoolReserves[0], bscPoolReserves[1]);

                arbitrageContainer.setCheapBasicTokenName(await arbitrageContractEth.getBasicName());
                arbitrageContainer.setCheapStableTokenName(await arbitrageContractEth.getStableName());
                arbitrageContainer.setExpensiveBasicTokenName(await arbitrageContractBsc.getBasicName());
                arbitrageContainer.setExpensiveStableTokenName(await arbitrageContractBsc.getStableName());

                return arbitrageContainer;
            case "ETH":
                arbitrageContainer =  new ArbitrageContractContainer(arbitrageContractBsc, oracleContractBsc, arbitrageContractEth, oracleContractEth);

                arbitrageContainer.setCheapArbitrageBalance(bscBasicBalance.stableBalance, bscBasicBalance.basicBalance);
                arbitrageContainer.setExpensiveArbitrageBalance(ethBasicBalance.stableBalance, ethBasicBalance.basicBalance);

                arbitrageContainer.setCheapPoolReserve(bscPoolReserves[0], bscPoolReserves[1]);
                arbitrageContainer.setExpensivePoolReserve(ethPoolReserves[0], ethPoolReserves[1]);

                arbitrageContainer.setCheapBasicTokenName(await arbitrageContractBsc.getBasicName());
                arbitrageContainer.setCheapStableTokenName(await arbitrageContractBsc.getStableName());
                arbitrageContainer.setExpensiveBasicTokenName(await arbitrageContractEth.getBasicName());
                arbitrageContainer.setExpensiveStableTokenName(await arbitrageContractEth.getStableName());

                return arbitrageContainer;
            default:
                return new Error("Swap destination network not supported.");
        }
    }

    async init() {
        let arbitrageContractEth = new ArbitrageContract("ETH");
        let arbitrageContractBsc = new ArbitrageContract("BSC");

        this.basicTokenAddressEth = await arbitrageContractEth.getBasicAddress();
        this.stableTokenAddressEth = await arbitrageContractEth.getStableAddress();

        this.basicTokenAddressBsc = await arbitrageContractBsc.getBasicAddress();
        this.stableTokenAddressBsc = await arbitrageContractBsc.getStableAddress();

        this.isInitialized = true;
    }
}

module.exports = ArbitrageFactory;