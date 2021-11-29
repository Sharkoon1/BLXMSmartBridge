const { ethers } = require('ethers');
const __path = require('path');
var constants = require('../constants');

class BridgeService {

    constructor() {
        const bridge_abi = require(__path.join(__dirname, '../abi/bridge_abi.json'));
        const erc20_abi = require(__path.join(__dirname, '../abi/erc20_abi.json'));

        this.wallet_BSC = new ethers.Wallet(process.env.PRIVATE_KEY, constants.PROVIDER_BSC);
        this.wallet_ETH = new ethers.Wallet(process.env.PRIVATE_KEY, constants.PROVIDER_ETH);

        this.contract_bridge_bsc = new ethers.Contract(constants.BRIDGE_ADDRESS, bridge_abi, this.wallet_BSC);
        this.contract_bridge_eth = new ethers.Contract(constants.BRIDGE_ADDRESS, bridge_abi, this.wallet_ETH);

        this.contract_blxm_token_bsc = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_BSC, erc20_abi, this.wallet_BSC);
        this.contract_usd_token_bsc = new ethers.Contract(constants.USD_TOKEN_ADRESS_BSC, erc20_abi, this.wallet_BSC);

        this.contract_blxm_token_eth = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_ETH, erc20_abi, this.wallet_ETH);
        this.contract_usd_token_eth = new ethers.Contract(constants.USD_TOKEN_ADRESS_ETH, erc20_abi, this.wallet_ETH);
    }

    async swapBLXMTokenETH() {
        var contract = new ethers.Contract(contractAddress, abi, wallet);

        var numberOfTokens = ethers.utils.parseUnits('10.0',numberOfDecimals);
        var options = { gasLimit: 1500000, gasPrice: ethers.utils.parseUnits('1.0', 'gwei') };
        
        var tx = await contract.transferFrom(fromAddress, targetAddress,numberOfTokens,options);
    }

    swapBLXMTokenBSC() {

    }

    swapUSDTokenETH() {

    }

    swapUSDTokenBSC() {

    }
}


module.exports = BridgeService;

console.log(ethers.utils.parseEther((15.2).toString()).toString());