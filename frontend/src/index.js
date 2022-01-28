import React, { StrictMode, Component, Fragment } from "react";
import "./style/LoginPage.css"

import ReactDOM from "react-dom";

import "./style/index.css"
import "./style/App.css";
import App from "./App";
import App1 from "./App1";
import Navbar from "./Navbar";
import Logs from "./Logs";
import Buttons from "./Buttons";
import SingleStep from "./SingleStep"
import FullAutonomous from "./FullAutonomous";
import AlertInfo from "./AlertInfo";
import ProgressOutline from "./ProgressOutline";

import Dashboad from "./Dashboad";
import UrlHandler from "./UrlHandler";
//import LoginPage from "./LoginPage";

const connectWalletHandler = () => {
	if (window.ethereum && window.ethereum.isMetaMask) {
		window.ethereum.request({ method: "eth_requestAccounts" })
			.then(result => {
				fetch(UrlHandler() + "api/authorization",
					{
						method: "post",
						headers: new Headers({ "content-type": "application/json" }),
						body: JSON.stringify({ User: result[0] })
					}).then(response => response.json()).then(result => {
						debugger;
						if (result.status === 1) {
							//####### NAVBAR #######
							const navbar = document.getElementById("navbar");
							ReactDOM.render(
								<StrictMode>
									<Navbar />
								</StrictMode>,
								navbar
							);

							//####### Abitrage Console Full Autonomous ####### 
							const rootElement2 = document.getElementById("buttons");
							ReactDOM.render(
								<StrictMode>
									<FullAutonomous />
								</StrictMode>,
								rootElement2
							);

							//####### Abitrage Console Single Step ####### 

							ReactDOM.render(
								<StrictMode>
									<SingleStep />
								</StrictMode>,
								rootElement1
							);

							//####### Dashboard ####### 
							const dashboardGraph = document.getElementById("root2");
							ReactDOM.render(
								<StrictMode>
									<Dashboad />
								</StrictMode>,
								dashboardGraph
							);
						} else {
							const ErrorMessage = document.getElementById("root");
							ReactDOM.render(
								<StrictMode>
									<AlertInfo message={"You are not authorized to access this website."} />
								</StrictMode>,
								ErrorMessage
							);
						}
					});
			})
			.catch(error => {
				const ErrorMessage = document.getElementById("root");
				ReactDOM.render(
					<StrictMode>
						<AlertInfo message={error.message} />
					</StrictMode>,
					ErrorMessage
				);
			});

	} else {
		console.log("Need to install MetaMask");
		setErrorMessage("Please install MetaMask browser extension to interact");
	}
}


function LoginPage() {
	return (
		<Fragment>
			<div className="empty"></div>
			<div className="loginPage">
				<img className="logoBLXM" src="../BLXMToken.png"></img>
				<h1 className="textLogin">Welcome to BLXM Smartbridge!!!</h1>
				<h1 className="textLogin">Login to enter admin view</h1>
				<button className="button" id="loginButton" onClick={connectWalletHandler}>Login with MetaMask</button>
			</div>
		</Fragment>
	);
}

const rootElement1 = document.getElementById("root1");
ReactDOM.render(
	<StrictMode>
		<LoginPage />
	</StrictMode>,
	rootElement1);



