const { ethers } = require('ethers');
const __path = require('path');
var constants = require('../constants.js');
require("dotenv").config();
 
class BridgeService {
 
    constructor() {
        console.log(process.env.PRIVATE_KEY);
        this.bridge_abi = require(__path.join(__dirname, '../abi/bridge_abi.json'));
        this.erc20_abi = require(__path.join(__dirname, '../abi/erc20_abi.json'));
 
        let provider_eth = new ethers.providers.JsonRpcProvider(constants.PROVIDER_ETH);
        let provider_bsc = new ethers.providers.JsonRpcProvider(constants.PROVIDER_BSC);
 
        this.wallet_BSC = new ethers.Wallet(process.env.PRIVATE_KEY, provider_eth);
        this.wallet_ETH = new ethers.Wallet(process.env.PRIVATE_KEY, provider_bsc);
 
        this.bridge_wallet_ETH = new ethers.Wallet(process.env.PRIVATE_KEY_BRIDGE, provider_eth);
        this.bridge_wallet_BSC = new ethers.Wallet(process.env.PRIVATE_KEY_BRIDGE, provider_bsc);
 
        this.contract_blxm_token_bsc = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_BSC, this.erc20_abi, this.wallet_BSC);
        this.contract_usd_token_bsc = new ethers.Contract(constants.USD_TOKEN_ADRESS_BSC, this.erc20_abi, this.wallet_BSC);
 
        this.contract_blxm_token_eth = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_ETH, this.erc20_abi, this.wallet_ETH);
        this.contract_usd_token_eth = new ethers.Contract(constants.USD_TOKEN_ADRESS_ETH, this.erc20_abi, this.wallet_ETH); 
 
        this.bridge_contract_blxm_token_bsc = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_BSC, this.erc20_abi, this.bridge_wallet_BSC);
        this.bridge_contract_usd_token_bsc = new ethers.Contract(constants.USD_TOKEN_ADRESS_BSC, this.erc20_abi, this.bridge_wallet_BSC);
 
        this.bridge_contract_blxm_token_eth = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_ETH, this.erc20_abi, this.bridge_wallet_ETH);
        this.bridge_contract_usd_token_eth = new ethers.Contract(constants.USD_TOKEN_ADRESS_ETH, this.erc20_abi, this.bridge_wallet_ETH); 
    }
 
    swapBLXMTokenETH() {
 
    }
 
    swapBLXMTokenBSC() {
 
    }
 
    async swapUSDTokenETH(amount) {
 
       /* var numberOfTokens = ethers.utils.parseEther(amount);*/
 
        let nounce1 = await this.wallet_ETH.getTransactionCount();
 
/*         console.log(nounce1);
 
        var options = {
            nonce: nounce1
        }
 
        var txEth = await this.contract_usd_token_eth.transfer(constants.ACCOUNT_2_ADRESS, numberOfTokens, options);    
 
        console.log(txEth); */
 
        let nounce2 = await this.bridge_wallet_BSC.getTransactionCount();
 
        numberOfTokens = ethers.utils.parseEther(amount);
 
        console.log(nounce2);
 
        var options2 = {
            nonce: nounce2
        }
 
        var txBsc = await this.bridge_contract_usd_token_bsc.transfer(constants.ACCOUNT_1_ADRESS, numberOfTokens, options2);    
 
        console.log(txBsc);
    }
 
    swapUSDTokenBSC() {
 
    }
}
 
var bridge = new BridgeService();
bridge.swapUSDTokenETH('1.0');
 
module.exports = BridgeService;