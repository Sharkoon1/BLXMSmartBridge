import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import App1 from "./App1";
import Buttons from "./Buttons";

//const rootElement = document.getElementById("Admin");

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

