const PoolReserve = require("./poolReserve");
const ArbitrageTokenName = require("./arbitrageTokenNames");
const ArbitrageBalance = require("./arbitrageBalance");

class ArbitrageContractContainer {
    constructor(cheapNetworkArbitrageContract, cheapNetworkOracleContract,  expensiveNetworkArbitrageContract, expensiveNetworkOracleContract) {
        this.cheapNetworkArbitrageContract = cheapNetworkArbitrageContract;
        this.cheapNetworkOracleContract = cheapNetworkOracleContract;
        this.expensiveNetworkArbitrageContract = expensiveNetworkArbitrageContract;
        this.expensiveNetworkOracleContract =  expensiveNetworkOracleContract;

        this.cheapArbitrageBalance;
        this.expensiveArbitrageBalance;

        this.cheapPoolReserve;
        this.expensivePoolReserve;

        this.cheapTokenNames;
        this.expensiveTokenNames;
    }

    setCheapArbitrageBalance(stable, basic) {
        this.cheapArbitrageBalance = new ArbitrageBalance(stable, basic);
    }

    setExpensiveArbitrageBalance(stable, basic) {
        this.expensiveArbitrageBalance = new ArbitrageBalance(stable, basic);
    }

    setExpensivePoolReserve(stable, basic) {
        this.expensivePoolReserve = new PoolReserve(stable, basic);
    }

    setCheapPoolReserve(stable, basic) {
        this.cheapPoolReserve = new PoolReserve(stable, basic);
    }

    setCheapTokenNames(stableName, basicName) {
        this.cheapStableTokenName = new ArbitrageTokenName(stableName, basicName);
    }

    setExpensiveTokenNames(stableName, basicName) {
        this.cheapStableTokenName = new ArbitrageTokenName(stableName, basicName);
    }
}

module.exports = ArbitrageContractContainer;