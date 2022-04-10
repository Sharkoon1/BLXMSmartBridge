import React, { StrictMode, useState, useEffect } from "react";
import { ethers } from "ethers";
import "./style/Navbar.css";
import ReactDOM from "react-dom"
import Dashboard from "./Dashboard";

export default function App() {

	const [show, setShow] = useState(false);
	const [chainID, setChainID] = useState("")


	useEffect(() => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		provider.getNetwork().then((networkID) => {
			if (networkID.chainId === 4 || networkID.chainId === 97){
				setChainID("Testnet");
			} else if (networkID.chainId === 1 || networkID.chainId === 56) {
				setChainID("Mainnet");
			}
		})
	});

	//Display Single step 
	function onClick() {
		//####### Abitrage Console Single Step ####### 
		const root1 = document.getElementById("root1");
		//####### Dashboard ####### 
		const root2 = document.getElementById("root2");

		const buttons = document.getElementById("buttons");
		const singlestep = document.getElementById("singlestep")
		const fullautonomous = document.getElementById("fullautonomous");
		const dashboard = document.getElementById("dashboard");

		//###### Abitrage Console Single Step ####### 
		root1.style.display = "block";
		//####### Dashboard ####### 
		root2.style.display = "none";
		ReactDOM.unmountComponentAtNode(root2); 

		buttons.style.display = "none";
		fullautonomous.classList.remove("topnav-centered-focus");
		singlestep.classList.add("topnav-centered-focus");
		dashboard.classList.remove("topnav-centered-focus");

	}

	//Display Dashboard
	function onClick2() {
		//####### Abitrage Console Single Step ####### 
		const root1 = document.getElementById("root1");
		//####### Dashboard ####### 
		const root2 = document.getElementById("root2");

		const buttons = document.getElementById("buttons");
		const singlestep = document.getElementById("singlestep")
		const fullautonomous = document.getElementById("fullautonomous");
		const dashboard = document.getElementById("dashboard");

		ReactDOM.render(
			<StrictMode>
				<Dashboard />
			</StrictMode>,
			root2
		);

		singlestep.classList.remove("topnav-centered-focus");
		fullautonomous.classList.remove("topnav-centered-focus");
		dashboard.classList.add("topnav-centered-focus");

		root.style.display = "none";
		root1.style.display = "none";
		buttons.style.display = "none";
		root2.style.display = "block";
	}

	//Display Full Autonomous 
	function onClick3() {
		fullautonomous.classList.add("topnav-centered-focus");
		singlestep.classList.remove("topnav-centered-focus");
		dashboard.classList.remove("topnav-centered-focus");

		root1.style.display = "none";
		root2.style.display = "none";
		ReactDOM.unmountComponentAtNode(root2); 
		buttons.style.display = "block";
	}



	return (
		<div className="topnav">
			{/* Right Nav */}
			<div className="topnav-right">
				<h1>{chainID}</h1>
			</div>


			{/* Centered Nav */}
			<div className="topnav-centered">
				<a href="#singlestep" id="singlestep" className="topnav-centered-focus" onClick={onClick}>Single Step</a>
				<a href="#fullautonomous" id="fullautonomous" className="" onClick={onClick3}>Full Autonomous</a>
				<a href="#dashboard" id="dashboard" className="" onClick={onClick2}>Dashboard</a>
			</div>

			{/* Left-aligned Image */}
			<img className="imageBig" src="../BloXmove_SmartBridge_Logo_v5.png"></img>
			<img className="imageSmall" src="../BLXMToken.png"></img>
		</div>


	);
}
