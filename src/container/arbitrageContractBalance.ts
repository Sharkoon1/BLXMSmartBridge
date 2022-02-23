import BigNumber from 'bignumber.js';

class ArbitrageContractBalance {
    stableBalance: BigNumber
    basicBalance: BigNumber

    constructor(stableBalance, basicBalance) {
        this.stableBalance = stableBalance; 
        this.basicBalance = basicBalance;
    }
}

export { ArbitrageContractBalance };