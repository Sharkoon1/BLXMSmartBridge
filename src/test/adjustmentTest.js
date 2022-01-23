const { ethers } = require("ethers");
const bn  = require('bignumber.js');

let two = ethers.BigNumber.from("2")
let test = ethers.BigNumber.from("-2002019150556163623133199607229336681530")
let minusOne = ethers.BigNumber.from("-1")

basicCheap = ethers.BigNumber.from("200000000000000000000")
stableCheap = ethers.BigNumber.from("250000000000000000000")
basicExpensive = ethers.BigNumber.from("150000000000000000000")
constantCheap = ethers.BigNumber.from("50000000000000000000000")
constantExpensive = ethers.BigNumber.from("30000000000000000000000")


ethers.BigNumber.prototype.sqrt = function() {
    console.log(this);
    return ethers.BigNumber.from(new bn(this.toString()).sqrt().toFixed().split('.')[0])
  }

  console.log(ethers.BigNumber.prototype);


function getAdjustmentValueUsdWithBigNumOperators(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive){

    let term1 = basicCheap.pow(2).mul(constantCheap).mul(constantExpensive);
    let term2 = two.mul(basicCheap).mul(basicExpensive).mul(constantCheap).mul(constantExpensive);
    let term3 = basicExpensive.pow(2).mul(constantCheap).mul(constantExpensive);
    let term4 = basicCheap.pow(2).mul(stableCheap.mul(minusOne));
    let term5 = two.mul(basicCheap).mul(basicExpensive).mul(stableCheap);
    let term6 = basicCheap.mul(constantCheap);
    let term7 = basicExpensive.pow(2).mul(stableCheap);
    let term8 = basicExpensive.mul(constantCheap);

    let term9 = basicCheap.pow(2);
    let term10 = two.mul(basicCheap).mul(basicExpensive);
    let term11 =  basicExpensive.pow(2);


    let adjustmentValue = ((term1.add(term2).add(term3)).sqrt().add(term4).sub(term5).add(term6).sub(term7).add(term8)).div((term9.add(term10.add(term11))));

    console.log(ethers.utils.formatEther((term1.add(term2).add(term3)).sqrt().add(term4).sub(term5).add(term6).sub(term7).add(term8)));
    console.log(ethers.utils.formatEther((term9.add(term10.add(term11)))));

    console.log(ethers.utils.formatEther(adjustmentValue));
};

getAdjustmentValueUsdWithBigNumOperators(basicCheap, stableCheap, basicExpensive, constantCheap, constantExpensive);

