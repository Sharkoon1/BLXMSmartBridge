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
		<FullAutonomous/>
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


