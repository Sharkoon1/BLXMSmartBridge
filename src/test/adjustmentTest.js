const { ethers } = require("ethers");
const BigNumber  = require('bignumber.js');
const constants = require("../constants");

adjustmentValue = new BigNumber("26.1905126125007")

basicCheapA = new BigNumber("300")
stableCheapA = new BigNumber("250")
basicExpensiveA = new BigNumber("150")
constantCheapA = new BigNumber("64500")
constantExpensiveA = new BigNumber("30000")

UniswapFees = new BigNumber(constants.UNISWAP_FEES)
pancakeswapFees = new BigNumber(constants.PANCAKESWAP_FEES)

basicCheapB = 200
stableCheapB = 250
basicExpensiveB = 150
constantCheapB = 50000
constantExpensiveB = 30000

function getAdjustmentValueUsdWithBigNumOperators(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive){
  let AdjustmentValue = (sqrt(basicCheap^2 * constantCheap * constantExpensive * constants.PANCAKESWAP_FEES^2 * constants.UNISWAP_FEES^2 + 2 * basicCheap * basicExpensive * constantCheap * constantExpensive * constants.PANCAKESWAP_FEES^2 * constants.UNISWAP_FEES + basicExpensive^2 * constantCheap * constantExpensive * constants.PANCAKESWAP_FEES^2) - 
  basicCheap^2 * constants.PANCAKESWAP_FEES * constants.UNISWAP_FEES^2 * stableCheap - 2 * basicCheap * basicExpensive * constants.PANCAKESWAP_FEES * constants.UNISWAP_FEES * stableCheap + basicCheap * constantCheap * constants.PANCAKESWAP_FEES * constants.UNISWAP_FEES^2 - basicExpensive^2 * constants.PANCAKESWAP_FEES * stableCheap + basicExpensive * constantCheap * constants.PANCAKESWAP_FEES * constants.UNISWAP_FEES)/
  (basicCheap^2 * constants.PANCAKESWAP_FEES^2 * constants.UNISWAP_FEES^2 + 2 * basicCheap * basicExpensive * constants.PANCAKESWAP_FEES^2 * constants.UNISWAP_FEES + basicExpensive^2 * constants.PANCAKESWAP_FEES ^2)

    let term1 = basicCheap.exponentiatedBy(2).multipliedBy(constantCheap).multipliedBy(constantExpensive);
    let term2 = basicCheap.multipliedBy(2).multipliedBy(basicExpensive).multipliedBy(constantCheap).multipliedBy(constantExpensive);
    let term3 = basicExpensive.exponentiatedBy(2).multipliedBy(constantCheap).multipliedBy(constantExpensive);
    let term4 = basicCheap.exponentiatedBy(2).multipliedBy(stableCheap.multipliedBy(-1));
    let term5 = basicCheap.multipliedBy(2).multipliedBy(basicExpensive).multipliedBy(stableCheap);
    let term6 = basicCheap.multipliedBy(constantCheap);
    let term7 = basicExpensive.exponentiatedBy(2).multipliedBy(stableCheap);
    let term8 = basicExpensive.multipliedBy(constantCheap);

    let term9 = basicCheap.exponentiatedBy(2);
    let term10 = basicCheap.multipliedBy(2).multipliedBy(basicExpensive);
    let term11 = basicExpensive.exponentiatedBy(2);    
    
    let adjustmentValue = ((term1.plus(term2).plus(term3).squareRoot()).plus(term4).minus(term5).plus(term6).minus(term7).plus(term8)).dividedBy((term9.plus(term10.plus(term11))));
    
    console.log(adjustmentValue.toString());

  };

function getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive){

  let adjustmentValue = (Math.sqrt(Math.pow(basicCheap, 2) * constantCheap * constantExpensive + 2 * basicCheap * basicExpensive * constantCheap * constantExpensive + 
      Math.pow(basicExpensive, 2) * constantCheap * constantExpensive) + 
      Math.pow(basicCheap, 2) * (-stableCheap) - 2 * basicCheap * basicExpensive * stableCheap + basicCheap * constantCheap - Math.pow(basicExpensive, 2) * 
      stableCheap + basicExpensive * constantCheap) / (Math.pow(basicCheap,2) + 2 * basicCheap * basicExpensive + Math.pow(basicExpensive, 2));


    console.log(adjustmentValue)  
}

function getAdjustmentValueWithFees(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive, UniswapFees, pancakeswapFees) {

let term1 = basicCheap.exponentiatedBy(2).multipliedBy(constantCheap).multipliedBy(constantExpensive).multipliedBy(pancakeswapFees.exponentiatedBy(2)).multipliedBy(UniswapFees.exponentiatedBy(2))
let term2 = (new BigNumber("2")).multipliedBy(basicCheap).multipliedBy(basicExpensive).multipliedBy(constantCheap).multipliedBy(constantExpensive).multipliedBy(pancakeswapFees.exponentiatedBy(2)).multipliedBy(UniswapFees)
let term3 = basicExpensive.exponentiatedBy(2).multipliedBy(constantCheap).multipliedBy(constantExpensive).multipliedBy(pancakeswapFees.exponentiatedBy(2)) 
let term4 = basicCheap.exponentiatedBy(2).multipliedBy(pancakeswapFees).multipliedBy(UniswapFees.exponentiatedBy(2)).multipliedBy(stableCheap) 
let term5 = (new BigNumber("2")).multipliedBy(basicCheap).multipliedBy(basicExpensive).multipliedBy(pancakeswapFees).multipliedBy(UniswapFees).multipliedBy(stableCheap)
let term6 = basicCheap.multipliedBy(constantCheap).multipliedBy(pancakeswapFees).multipliedBy(UniswapFees.exponentiatedBy(2))
let term7 = basicExpensive.exponentiatedBy(2).multipliedBy(pancakeswapFees).multipliedBy(stableCheap)
let term8 = basicExpensive.multipliedBy(constantCheap).multipliedBy(pancakeswapFees).multipliedBy(UniswapFees)
let term9 = basicCheap.exponentiatedBy(2).multipliedBy(pancakeswapFees.exponentiatedBy(2)).multipliedBy(UniswapFees.exponentiatedBy(2))
let term10 = (new BigNumber("2")).multipliedBy(basicCheap).multipliedBy(basicExpensive).multipliedBy(pancakeswapFees.exponentiatedBy(2)).multipliedBy(UniswapFees)
let term11 = basicExpensive.exponentiatedBy(2).multipliedBy(pancakeswapFees.exponentiatedBy(2))

let term1_8 = ((term1.plus(term2).plus(term3)).squareRoot()).minus(term4).minus(term5).plus(term6).minus(term7).plus(term8)
let term9_11 = term9.plus(term10).plus(term11)

let adjustmentValue = term1_8.dividedBy(term9_11)

return adjustmentValue;

}

function checkBignumberOp(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive, UniswapFees, pancakeswapFees){


  stableCheapNew = stableCheap.plus(adjustmentValue);
  let numerator = adjustmentValue.multipliedBy(pancakeswapFees).multipliedBy(basicCheap);
  let denumerator = stableCheap.plus(adjustmentValue.multipliedBy(pancakeswapFees));
  basicCheapNew = basicCheap.minus(numerator.dividedBy(denumerator));

}


//etAdjustmentValueUsdWithBigNumOperators(basicCheapA, stableCheapA, basicExpensiveA, constantCheapA, constantExpensiveA);

//getAdjustmentValueUsd(basicCheapB, stableCheapB, basicExpensiveB, constantCheapB, constantExpensiveB)

//getAdjustmentValueWithFees(basicCheapA, stableCheapA, basicExpensiveA, constantCheapA, constantExpensiveA, UniswapFees, pancakeswapFees);

checkBignumberOp(basicCheapA, stableCheapA, basicExpensiveA, constantCheapA, constantExpensiveA, UniswapFees, pancakeswapFees);
