import React, { useState } from "react";
import { ethers } from "ethers";
import "./style/WalletCard.css";
import ErrorMessage from "./ErrorMessage";

const WalletCardEthers = () => {

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [userNetwork, setUserNetwork] = useState(null);
	const [connButtonText, setConnButtonText] = useState("Connect Wallet");

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: "eth_requestAccounts" })
				.then(result => {
					accountChangedHandler(result[0]);
					getAccountBalance(result[0]);
				})
				.catch(error => {
					setErrorMessage(error.message);

				});

		} else {
			console.log("Need to install MetaMask");
			setErrorMessage("Please install MetaMask browser extension to interact");
		}
	};

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
	};

	const getAccountBalance = (account) => {
		const BLXM_TOKEN_ADDRESS_BSC = "0x6703bB029a9B2d44f8e21Ec7f635C5A0b06743Fa";
		const BLXM_TOKEN_ADDRESS_ETH = "0xb5382dfba952a41a2f2d0b7313c3578b83d32be0";

		const genericErc20Abi = require("./abi/erc20_abi.json");

		const provider = new ethers.providers.Web3Provider(window.ethereum);

		(async () => {
			const networkName = await (await provider.getNetwork()).name;
			let tokenContractAddress;
			if (networkName === "bnbt") {
				tokenContractAddress = BLXM_TOKEN_ADDRESS_BSC;
				setUserNetwork("Binance Smart Chain");
			} else if (networkName === "rinkeby") {
				tokenContractAddress = BLXM_TOKEN_ADDRESS_ETH;
				setUserNetwork("Ethereum Blockchain");
			} else {
				console.log("Network not defined!");
			}
			try {
				const contract = new ethers.Contract(tokenContractAddress, genericErc20Abi, provider.getSigner());
				const balance = await contract.balanceOf(account);
				setUserBalance(ethers.utils.formatEther(balance.toString()));
				setConnButtonText("Wallet Connected");
			} catch(error){
				setErrorMessage("Network you are operating in is not defined!")
			}

		})();
	};


	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	};

	// listen for account changes
	window.ethereum.on("accountsChanged", accountChangedHandler);

	window.ethereum.on("chainChanged", chainChangedHandler);
	const dataDisplay = (
		<div className="displayWalletDetails">
			<div className="accountDisplay">
				<h4 className="displayWalletDetailsText">Address: {defaultAccount}</h4>
			</div>
			<div className="balanceDisplay">
				<h4 className="displayWalletDetailsText">Balance: {userBalance}</h4>
			</div>
			<div className="networkDisplay">
				<h4 className="displayWalletDetailsText">Network: {userNetwork}</h4>
			</div>
			{
				userNetwork ?
					<div className="swapInformation">
						<h4 className="displayWalletDetailsText">You will be swapping from the {userNetwork} to the {userNetwork === "Ethereum Blockchain" ? "Binance Smart Chain" : "Ethereum Blockchain"}</h4>
					</div> : null
			}
		</div>
	);
	const buttonTooltip = "Click here to connect your wallet once connected to BSC Testnet or Rinkeby Testnet."
	return (
		<div className="walletCard w-full lg:w-1/2 shadow-lg mx-auto rounded-xl bg-white mx-auto">
			<button onClick={connectWalletHandler} className="button" title = {connButtonText !== "Wallet Connected" ? buttonTooltip: null}>{connButtonText}</button>
			{connButtonText === "Wallet Connected" && errorMessage===null ? dataDisplay : null}
			<ErrorMessage message={errorMessage} />
		</div>
	);
};

export default WalletCardEthers;