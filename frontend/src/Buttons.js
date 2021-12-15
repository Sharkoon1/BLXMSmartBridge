import React, { useState } from "react";

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

	const startJob = () => {
		/*
		fetch("http://localhost:3000/api/singleArbitrage",
			{
				method: "post",
			}).then(() => {
			setConnButtonText(connButtonText === "Job Running" ? "Job not running" : "Job running");
		})
			.catch(error => {
				setErrorMessage(error.message);
			});
		*/
		setConnButtonText(connButtonText === "Job running" ? "Job not running" : "Job running");
	};
	const Buttonstyle = {
		margin: "50px"
	};
	return (
		<div>
			<button onClick={startArbitrage} className="button" style={Buttonstyle}>Run Single Arbitrage Cycle</button>
			<button onClick={startJob} className="button">{connButtonText}</button>
			{errorMessage}
		</div>
	);
};

export default Buttons;