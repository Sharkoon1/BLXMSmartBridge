import React, { useState } from "react";
import { ethers } from "ethers";
import "./WalletCard.css";

const WalletCardEthers = () => {

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [userNetwork, setUserNetwork] = useState(null);
	const [connButtonText, setConnButtonText] = useState("Connect Wallet");

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log("MetaMask Here!");

			window.ethereum.request({ method: "eth_requestAccounts" })
				.then(result => {
					accountChangedHandler(result[0]);
					setConnButtonText("Wallet Connected");
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
			const contract = new ethers.Contract(tokenContractAddress, genericErc20Abi, provider.getSigner());
			const balance = await contract.balanceOf(account);
			setUserBalance(ethers.utils.formatEther(balance.toString()));
		})();
	};


	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	};

	// listen for account changes
	window.ethereum.on("accountsChanged", accountChangedHandler);

	window.ethereum.on("chainChanged", chainChangedHandler);

	const Textstyle = {
		color: "black",
	};
	return (
		<div  className="walletCard w-full lg:w-1/2 shadow-lg mx-auto rounded-xl bg-white mx-auto">
			<button onClick={connectWalletHandler} className="button">{connButtonText}</button>
			<div className="accountDisplay">
				<h3 style={Textstyle}>Address: {defaultAccount}</h3>
			</div>
			<div className="balanceDisplay">
				<h3 style={Textstyle}>Balance: {userBalance}</h3>
			</div>
			<div className="networkDisplay">
				<h3 style={Textstyle}>Network: {userNetwork}</h3>
			</div>
			{userNetwork ?
				<div className="swapInformation">
					<h3 style={Textstyle}>You will be swapping from the {userNetwork} to the {userNetwork === "Ethereum Blockchain" ? "Binance Smart Chain" : "Ethereum Blockchain"}</h3>
				</div> : null
			}
			{errorMessage}
		</div>
	);
};

export default WalletCardEthers;