require("dotenv").config();
const constants = require("../constants");
const Contracts = require("../contracts/Contracts");
const WalletContainer = require("../wallet/WalletContainer");
const { ethers } = require("ethers");


class ArbitrageServiceTest{

    constructor () {
        this.contractsEth = new Contracts("eth", WalletContainer.ArbitrageWalletETH);
    }

    async testEth(){
    
        console.log("testSwapStableToBasic:");
        await this.testSwapStableToBasic();
        console.log("testSwapBasicToStable:");
        setTimeout(() => { this.testSwapBasicToStable()}, 10000);
        
        }
    
    async testSwapStableToBasic(){
        
    let blxmEthBalance = await this.contractsEth.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_ETH);
    let usdEthBalance = await this.contractsEth.usdTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_ETH);
    
    let tx = await this.contractsEth.arbitrageContract.swapStableToBasic(5);
    
    await tx.wait();
    
    let blxmEthBalanceNew = await this.contractsEth.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_ETH);
    let usdEthBalanceNew = await this.contractsEth.usdTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_ETH);
    
    let trueFalse = blxmEthBalance < blxmEthBalanceNew && usdEthBalance > usdEthBalanceNew;

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
        let blxmEthBalance = await this.contractsEth.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_ETH);
        let usdEthBalance = await this.contractsEth.usdTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_ETH);
        
        let tx = await this.contractsEth.arbitrageContract.swapBasicToStable(5);
        
        await tx.wait();
        
        let blxmEthBalanceNew = await this.contractsEth.blxmTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_ETH);
        let usdEthBalanceNew = await this.contractsEth.usdTokenContract.getTokenBalance(constants.ARBITRAGE_CONTRACT_ADDRESS_ETH);
        
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

new ArbitrageServiceTest().testEth();

