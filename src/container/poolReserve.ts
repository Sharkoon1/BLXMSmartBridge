import BigNumber from 'bignumber.js';

class PoolReserve {
    stableBalance: BigNumber
    basicBalance: BigNumber

    constructor(stableBalance, basicBalance) {
        this.stableBalance = stableBalance;
        this.basicBalance = basicBalance;
    }
}

export { PoolReserve };