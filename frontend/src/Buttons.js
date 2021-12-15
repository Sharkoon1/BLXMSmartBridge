import React, { useState, useEffect } from "react";

const Buttons = () => {

	const [errorMessage, setErrorMessage] = useState(null);
	const [connButtonText, setConnButtonText] = useState("Job not running");

	const startArbitrage = () => {

		fetch("http://localhost:3000/api/singleArbitrage",
			{
				method: "post",
			}).then(() => {
			setConnButtonText("Wallet Connected");
		})
			.catch(error => {
				setErrorMessage(error.message);
			});
	};
	useEffect(() => {
		fetch("http://localhost:3000/api/toggleArbitrage",
			{
				method: "get",
			}).then(response => response.json())
			.then(data => setConnButtonText(data ? "Job running" : "Job not running"));
	});

	const toggleJobStatus = () => {
		fetch("http://localhost:3000/api/toggleArbitrage",
			{
				method: "post",
			}).then(() => {
			setConnButtonText(connButtonText === "Job Running" ? "Job not running" : "Job running");
		})
			.catch(error => {
				setErrorMessage(error.message);
			});
	};
	const Buttonstyle = {
		margin: "50px"
	};
	return (
		<div>
			<button onClick={startArbitrage} className="button" style={Buttonstyle}>Run Single Arbitrage Cycle</button>
			<button onClick={toggleJobStatus} className="button">{connButtonText}</button>
			{errorMessage}
		</div>
	);
};

export default Buttons;