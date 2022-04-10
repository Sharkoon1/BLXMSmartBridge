import React, { StrictMode, Fragment, useState } from "react";
import "./style/LoginPage.css"

import ReactDOM from "react-dom";

import "./style/index.css"
import "./style/App.css";
import Navbar from "./Navbar";
import SingleStep from "./SingleStep"
import FullAutonomous from "./FullAutonomous";
import AlertInfo from "./AlertInfo";

import Dashboard from "./Dashboard";
import UrlHandler from "./UrlHandler";

const connectWalletHandler = (setError, setOtherError) => {
	if (window.ethereum && window.ethereum.isMetaMask) {
		window.ethereum.request({ method: "eth_requestAccounts" })
			.then(result => {						
				fetch(UrlHandler() + "api/authorization/login",
					{
						method: "post",
						headers: new Headers({ "content-type": "application/json" }),
						body: JSON.stringify({ account: result[0] })
					}).then(response => response.json()).then(result => {
						if (result.status === 1) {
							localStorage.setItem("token", result.data.token);
							RenderPages();
						} else {
							setError(true);
						}
					});
			})
			.catch(error => {
				setOtherError(error.message);
			});

    } else {
        console.log("Need to install MetaMask");
    }
}

function RenderPages() {
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
	const rootElement1 = document.getElementById("root1");
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
			<Dashboard />
		</StrictMode>,
		dashboardGraph
	);
}


function LoginPage() {
	const [error, setError] = useState(false);
	const [othererror, setOtherError] = useState("");
	
	return (
		<Fragment>
			<div className="empty"></div>
			<div className="loginPage">
				<img className="logoBLXM" src="../BLXMToken.png"></img>
				<h1 className="textLogin">Welcome to BLXM Smartbridge!</h1>
				<h1 className="textLogin">Login to enter admin view</h1>
				<button className="button" id="loginButton" onClick={() => connectWalletHandler(setError, setOtherError)}>Login with MetaMask</button>
			</div>
			<div style={{ width: "40%" , marginLeft: "auto", marginRight: "auto"}}>
				{error ? <AlertInfo message={"You are not authorized to access this website."} /> : null}
				{othererror !== "" ? <AlertInfo message={othererror} /> : null}
			</div>
		</Fragment>
	);
}


let token = localStorage.getItem("token");

if(token) {
	 RenderPages();
}

else {
	const rootElement1 = document.getElementById("root1");
	ReactDOM.render(
		<StrictMode>
			<LoginPage />
		</StrictMode>,
		rootElement1);
}


