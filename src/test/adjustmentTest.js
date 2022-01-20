const { ethers } = require("ethers");

let two = ethers.BigNumber.from("2")
let test = ethers.BigNumber.from("-2002019150556163623133199607229336681530")
let minusOne = ethers.BigNumber.from("-1")

basicCheap = 150
stableCheap = 200
basicExpensive = 48
constantCheap = 30000
constantExpensive = 8832

getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive)

function getAdjustmentValueUsd(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive){

    let adjustmentValue = (Math.sqrt(Math.pow(basicCheap, 2) * constantCheap * constantExpensive + 2 * basicCheap * basicExpensive * constantCheap * constantExpensive + 
    Math.pow(basicExpensive, 2) * constantCheap * constantExpensive) + Math.pow(basicCheap, 2) * (-stableCheap) - 2 * basicCheap * basicExpensive * stableCheap + basicCheap * constantCheap - Math.pow(basicExpensive, 2) * 
    stableCheap + basicExpensive * constantCheap) / (Math.pow(basicCheap,2) + 2 * basicCheap * basicExpensive + Math.pow(basicExpensive, 2));

    console.log(adjustmentValue);
};

function getAdjustmentValueUsdWithBigNumOperators(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive){

    let adjustmentValue = ((basicCheap.pow(2).mul(constantCheap).mul(constantExpensive).add(two).mul(basicCheap).mul(basicExpensive)
    .mul(constantCheap).mul(constantExpensive).add(basicExpensive.pow(2)).mul(constantCheap).mul(constantExpensive)).pow(0.5).add(basicCheap.pow(2)).mul(stableCheap.mul(minusOne)).sub 2 * basicCheap * basicExpensive * stableCheap + basicCheap * constantCheap - Math.pow(basicExpensive, 2) * 
    stableCheap + basicExpensive * constantCheap) / (Math.pow(basicCheap,2) + 2 * basicCheap * basicExpensive + Math.pow(basicExpensive, 2));

    console.log(adjustmentValue);
};

console.log(two.mul(minusOne))


