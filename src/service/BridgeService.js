var constants = require("../constants.js");
const Contracts  = require("../contracts/Contracts");
const logger = require("../logger/logger");
const { ethers } = require("ethers");

class BridgeService {
 
	constructor(walletContainer) {
		this._walletContainer = walletContainer;
		this._ethContracts = new Contracts("ETH", this._walletContainer.ArbitrageWalletETH);
		this._bscContracts = new Contracts("BSC", this._walletContainer.ArbitrageWalletBSC);

		this._bridgeEthContracts = new Contracts("ETH", this._walletContainer.BridgeWalletETH);
		this._bridgeBscContracts = new Contracts("BSC", this._walletContainer.BridgeWalletBSC);
	}	

	async bridgeBLXMTokenEthToBsc(amount) {
		await this._ethContracts.blxmTokenContract.transferTokens(constants.BRIDGE_WALLET_ADDRESS, amount);    	
		await this._bridgeBscContracts.blxmTokenContract.transferTokens(constants.ARBITRAGE_WALLET_ADDRESS, amount);   
	}
 
	async bridgeBLXMTokenBscToEth(amount) {
		await this._bscContracts.blxmTokenContract.transferTokens(constants.BRIDGE_WALLET_ADDRESS, amount);    	
		await this._bridgeEthContracts.blxmTokenContract.transferTokens(constants.ARBITRAGE_WALLET_ADDRESS, amount);   
	}
 
	async bridgeUSDTokenEthToBsc(amount) {
		logger.info("Bridging " + ethers.utils.formatEther(amount) + " USDC from BSC to ETH.");

		await this._ethContracts.usdTokenContract.transferTokens(constants.BRIDGE_WALLET_ADDRESS, amount);    	
		await this._bridgeBscContracts.usdTokenContract.transferTokens(constants.ARBITRAGE_WALLET_ADDRESS, amount);   
	}
 
	async bridgeUSDTokenBscToEth(amount) {
		logger.info("Bridging " + ethers.utils.formatEther(amount) + " USDC from ETH to BSC.");

		await this._bscContracts.usdTokenContract.transferTokens(constants.BRIDGE_WALLET_ADDRESS, amount);    	
		await this._bridgeEthContracts.usdTokenContract.transferTokens(constants.ARBITRAGE_WALLET_ADDRESS, amount);       
	}
}
 
module.exports = BridgeService;
 
