import BigNumber from 'bignumber.js';

class PoolReserve {
    stable: BigNumber
    basic: BigNumber

    constructor(stable, basic) {
        this.stable = stable;
        this.basic = basic;
    }
}

export { PoolReserve };