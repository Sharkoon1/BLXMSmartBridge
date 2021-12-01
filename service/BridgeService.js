const { ethers } = require("ethers");
const __path = require("path");
var constants = require("../constants.js");
const utility = require("../helpers/utility");

class BridgeService {
 
	constructor() {
		this.bridge_abi = require(__path.join(__dirname, "../abi/bridge_abi.json"));
		this.erc20_abi = require(__path.join(__dirname, "../abi/erc20_abi.json"));
        
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

		this.bridge_wallet_contract_blxm_token_bsc = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_BSC, this.erc20_abi, this.bridge_wallet_BSC);
		this.bridge_wallet_contract_usd_token_bsc = new ethers.Contract(constants.USD_TOKEN_ADRESS_BSC, this.erc20_abi, this.bridge_wallet_BSC);
 
		this.bridge_wallet_contract_blxm_token_eth = new ethers.Contract(constants.BLXM_TOKEN_ADDRESS_ETH, this.erc20_abi, this.bridge_wallet_ETH);
		this.bridge_wallet_contract_usd_token_eth = new ethers.Contract(constants.USD_TOKEN_ADRESS_ETH, this.erc20_abi, this.bridge_wallet_ETH); 
	}

	async swapBLXMTokenEthToBsc(amount) {
		await this.contract_blxm_token_eth.transfer(constants.BRIDGE_WALLET_ADDRESS, utility.toWei(amount));    
		await this.bridge_wallet_contract_blxm_token_bsc.transfer(constants.ARBITRAGE_WALLT_ADDRESS, utility.toWei(amount));   
	}
 
	async swapBLXMTokenBscToEth(amount) {
		await this.contract_blxm_token_bsc.transfer(constants.BRIDGE_WALLET_ADDRESS, utility.toWei(amount));    
		await this.bridge_wallet_contract_blxm_token_eth.transfer(constants.ARBITRAGE_WALLT_ADDRESS, utility.toWei(amount));   
	}
 
	async swapUSDTokenEthToBsc(amount) {
		await this.contract_usd_token_eth.transfer(constants.BRIDGE_WALLET_ADDRESS, utility.toWei(amount));            
		await this.bridge_wallet_contract_usd_token_bsc.transfer(constants.ARBITRAGE_WALLT_ADDRESS, utility.toWei(amount));    
	}
 
	async swapUSDTokenBscToEth(amount) {
		await this.contract_usd_token_bsc.transfer(constants.BRIDGE_WALLET_ADDRESS, utility.toWei(amount));            
		await this.bridge_wallet_contract_usd_token_eth.transfer(constants.ARBITRAGE_WALLT_ADDRESS, utility.toWei(amount));     
	}
}
 
module.exports = BridgeService;
 
