import React, { useState } from "react";

const Buttons = () => {

	const [errorMessage, setErrorMessage] = useState(null);
	const [connButtonText, setConnButtonText] = useState("Job Running");

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
	};

	return (
		<div>
			<button onClick={startArbitrage} className="button">Run Single Arbitrage Cycle</button>
			<button onClick={startJob} className="button">{connButtonText}</button>
			{errorMessage}
		</div>
	);
};

export default Buttons;