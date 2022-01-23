require("dotenv").config();
const constants = require("../constants");
const Contracts = require("../contracts/Contracts");
const { ethers } = require("ethers");


class ArbitrageServiceTest{

    constructor () {
        this.contractsBsc = new Contracts("BSC");
    }

    async testBsc(){
    
        console.log("testSwapStableToBasic:");
        await this.testSwapStableToBasic();
        console.log("testSwapBasicToStable:");
        setTimeout(() => { this.testSwapBasicToStable()}, 10000);
        
        }
    
    async testSwapStableToBasic(){
        
    let blxmEthBalance = await this.contractsBsc.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_BSC);
    let usdEthBalance = await this.contractsBsc.usdTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_BSC);
    
    let tx = await this.contractsBsc.arbitrageContract.swapStableToBasic(5);
    
    await tx.wait();
    
    let blxmEthBalanceNew = await this.contractsBsc.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_BSC);
    let usdEthBalanceNew = await this.contractsBsc.usdTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_BSC);
    
    let trueFalse = blxmEthBalance.lt(blxmEthBalanceNew) && usdEthBalance.gt(usdEthBalanceNew);

    if(trueFalse){
        console.log(trueFalse)
        console.log("blxm old: " + ethers.utils.formatEther(blxmEthBalance) + " -> " + "blxm new: " + ethers.utils.formatEther(blxmEthBalanceNew))
        console.log("usd old: " + ethers.utils.formatEther(usdEthBalance) + " -> " + "usd new: " + ethers.utils.formatEther(usdEthBalanceNew))
    
        }
        else{
            console.log(trueFalse)
            console.log("blxm old: " + ethers.utils.formatEther(blxmEthBalance) + " -> " + "blxm new: " + ethers.utils.formatEther(blxmEthBalanceNew))
            console.log("usd old: " + ethers.utils.formatEther(usdEthBalance) + " -> " + "usd new: " + ethers.utils.formatEther(usdEthBalanceNew))
        }
    }
    
    async testSwapBasicToStable(){
        let blxmEthBalance = await this.contractsBsc.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_BSC);
        let usdEthBalance = await this.contractsBsc.usdTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_BSC);
        
        let tx = await this.contractsBsc.arbitrageContract.swapBasicToStable(5);
        
        await tx.wait();
        
        let blxmEthBalanceNew = await this.contractsBsc.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_BSC);
        let usdEthBalanceNew = await this.contractsBsc.usdTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_BSC);
        
        if(blxmEthBalance > blxmEthBalanceNew && usdEthBalance < usdEthBalanceNew){
            console.log("true")
            console.log("blxm old: " + ethers.utils.formatEther(blxmEthBalance) + " -> " + "blxm new: " + ethers.utils.formatEther(blxmEthBalanceNew))
            console.log("usd old: " + ethers.utils.formatEther(usdEthBalance) + " -> " + "usd new: " + ethers.utils.formatEther(usdEthBalanceNew))
        }
        else{
            console.log("false")
            console.log("blxm old: " + ethers.utils.formatEther(blxmEthBalance) + " -> " + "blxm new: " + ethers.utils.formatEther(blxmEthBalanceNew))
            console.log("usd old: " + ethers.utils.formatEther(usdEthBalance) + " -> " + "usd new: " + ethers.utils.formatEther(usdEthBalanceNew))
        }
    }
    
}

new ArbitrageServiceTest().testBsc();

