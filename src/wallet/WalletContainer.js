const { ethers } = require("ethers");
const constants = require("../constants");

class WalletContainer {
	constructor() {
		const providerETH = new ethers.providers.JsonRpcProvider(constants.PROVIDER_ETH);
		const providerBSC = new ethers.providers.JsonRpcProvider(constants.PROVIDER_BSC);
		this.ArbitrageWalletETH = new ethers.Wallet(process.env.PRIVATE_KEY, providerETH);
		this.ArbitrageWalletBSC = new ethers.Wallet(process.env.PRIVATE_KEY, providerBSC);
		this.BridgeWalletETH = new ethers.Wallet(process.env.PRIVATE_KEY_BRIDGE, providerETH);
		this.BridgeWalletBSC = new ethers.Wallet(process.env.PRIVATE_KEY_BRIDGE, providerBSC);
	}
}

module.exports = new WalletContainer();

