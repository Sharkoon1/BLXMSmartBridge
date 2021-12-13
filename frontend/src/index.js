import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import App1 from "./App1";
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