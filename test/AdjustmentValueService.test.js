
//Liquidity Pool expansive
var  BLXM_CHEAP= 1310;     // Liquidity pool Pancacke Swap
var  USD_CHEAP= 5000;    // Liquidity pool Pancacke Swap
//Liquidity Pool cheap
var BLXM_EXPANSIVE = 233.9606946033066;     // Liquidity pool Uniswap
var USD_EXPANSIVE = 19234;     // Liquidity pool Uniswap

var expect = require('chai').expect;

const getAdjustmentValue = require("../service/GetAdjustmentValueService.js");
describe("Adjustment Value Tets", () => {
    it('Returns 851.8569696479246 for BLXM_CHEAP = 1310, USD_CHEAP = 5000, BLXM_EXPANSIVE = 233.9606946033066, USD_EXPANSIVE = 19234', () => {
        expect(getAdjustmentValue(BLXM_CHEAP, USD_CHEAP, BLXM_EXPANSIVE, USD_EXPANSIVE)).to.equal(851.8569696479246);
    })
});

