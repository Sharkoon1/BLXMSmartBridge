import React, { useState, useEffect } from "react";
import "./style/Buttons.css";

const Buttons = () => {
	const runningMessage = "Job running";
	const notRunningMessage = "Job not running";
	const [errorMessage, setErrorMessage] = useState(null);
	const [connButtonText, setConnButtonText] = useState("");

	
	const startArbitrage = () => {

		fetch("http://localhost:3001/api/singleArbitrage",
			{
				method: "post",
			}).then(() => {
		})
			.catch(error => {
				setErrorMessage(error.message);
			});
	};

	useEffect(() => {
		fetch("http://localhost:3001/api/toggleArbitrage",
			{
				method: "get",
			}).then(response => response.json())
			.then(data => setConnButtonText(data ? runningMessage : notRunningMessage));
	});

	const toggleJobStatus = () => {
		fetch("http://localhost:3001/api/toggleArbitrage",
			{
				method: "post",
			}).then(response => response.json())
			.then(data => setConnButtonText(data ? runningMessage : notRunningMessage)
			)
			.catch(error => {
				setErrorMessage(error.message);
			});
	};
	const Buttonstyle = {
		margin: "50px"
	};
	return (
		<div className="adminPanel">
			
			<button onClick={startArbitrage} className="button" id="runSingle" >Run Single Arbitrage Cycle</button>
			<button onClick={toggleJobStatus} className="button" id="toggleStatus">{connButtonText}</button>
			{errorMessage}
		</div>
	);
};

export default Buttons;