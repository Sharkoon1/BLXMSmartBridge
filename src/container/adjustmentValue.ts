import BigNumber from 'bignumber.js';

class AdjustmentValue {
    stable: BigNumber
    basic: BigNumber

    constructor(stable, basic) {
        this.stable = stable; 
        this.basic = basic;
    }
}

export { AdjustmentValue };