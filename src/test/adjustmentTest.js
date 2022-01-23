const { ethers } = require("ethers");
const BigNumber  = require('bignumber.js');

basicCheapA = new BigNumber("200")
stableCheapA = new BigNumber("250")
basicExpensiveA = new BigNumber("150")
constantCheapA = new BigNumber("50000")
constantExpensiveA = new BigNumber("30000")

basicCheapB = 200
stableCheapB = 250
basicExpensiveB = 150
constantCheapB = 50000
constantExpensiveB = 30000

function getAdjustmentValueUsdWithBigNumOperators(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive){

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

getAdjustmentValueUsdWithBigNumOperators(basicCheapA, stableCheapA, basicExpensiveA, constantCheapA, constantExpensiveA);

getAdjustmentValueUsd(basicCheapB, stableCheapB, basicExpensiveB, constantCheapB, constantExpensiveB)
