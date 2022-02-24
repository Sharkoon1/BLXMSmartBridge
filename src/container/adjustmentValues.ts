import BigNumber from 'bignumber.js';

class AdjustmentValues {
    stable: BigNumber
    basic: BigNumber

    constructor(stable, basic) {
        this.stable = stable; 
        this.basic = basic;
    }
}

export { AdjustmentValues };