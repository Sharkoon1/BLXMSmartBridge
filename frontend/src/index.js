import { StrictMode } from "react";
import ReactDOM from "react-dom";

import "./index.css"
import "./App.css";
import App from "./App";
import App1 from "./App1";
import Buttons from "./Buttons";
import socketIOClient from "socket.io-client";
import Navbar from "./Navbar";


//const rootElement = document.getElementById("Admin");
const navbar = document.getElementById("navbar");
ReactDOM.render(
	<StrictMode>
		<Navbar />
	</StrictMode>,
	navbar
);
const rootElement = document.getElementById("root");
ReactDOM.render(
	<StrictMode>
		<App1 />
	</StrictMode>,
	rootElement
);
const rootElement1 = document.getElementById("root1");
ReactDOM.render(
	<StrictMode>
		<App />
	</StrictMode>,
	rootElement1
);

const rootElement2 = document.getElementById("buttons");
ReactDOM.render(
	<StrictMode>
		<Buttons />
	</StrictMode>,
	rootElement2
);

let ioClient = socketIOClient.connect("http://localhost:3002");

ioClient.on("connection",(socket) => {
	console.log(socket);
	console.log("connected!");
});

ioClient.on("log", function(msg){
	console.log(msg);
});
