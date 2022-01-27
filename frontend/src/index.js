import { StrictMode } from "react";
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

						//####### Connect wallet ####### 
						//const rootElement = document.getElementById("root");
						//ReactDOM.render(
						//	<StrictMode>
						//		<App1 />
						//	</StrictMode>,
						//	rootElement
						//);

						//####### Swap Functionality  ####### 
						//const rootElement1 = document.getElementById("root1");
						//ReactDOM.render(
						//	<StrictMode>
						//		<App />
						//	</StrictMode>,
						//	rootElement1
						//);

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
								<Dashboad />
							</StrictMode>,
							dashboardGraph
						);
					}
				});
		})
		.catch(error => {
			const ErrorMessage = document.getElementById("root1");
			ReactDOM.render(
				<StrictMode>
					<AlertInfo message={error.message}/>
				</StrictMode>,
				ErrorMessage
			);
		});

} else {
	console.log("Need to install MetaMask");
	setErrorMessage("Please install MetaMask browser extension to interact");
}


