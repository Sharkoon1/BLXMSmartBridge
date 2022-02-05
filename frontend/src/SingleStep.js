import React, { Fragment, useEffect } from 'react';
import Logs from './Logs';
import "./style/SingleStep.css"
import SettingsModal from './SettingsModal';
import UrlHandler from "./UrlHandler";
import ProgressOutline from './ProgressOutline';
import { get } from "./RequestHandler";
import { post } from "./RequestHandler";


export default function SingleStep() {
	var url = UrlHandler();

	const [stopIsDisabled, setStopDisabled] = React.useState(false)
	const [startIsDisabled, setStartDisabled] = React.useState(false)
	const [status, setStepStatus] = React.useState(1)
	const [showResults, setShowResults] = React.useState(false)
	const onClick = () => setShowResults(!showResults)

	useEffect(() => {
		get(url + "api/arbitrage/stepStatus").then(result => {
				if (result.data.stepStatus) {
					setStepStatus(result.data.stepStatus);
				}
			});
	}, []);

	function onStop() {
		setStopDisabled(true);
		setStepStatus(1);

		post(url + "api/arbitrage/stopStep").then(() => {
				setStopDisabled(false);
			});
	}

	function onNextStep() {
		setStartDisabled(true);
		post(url + "api/arbitrage/singleStep", { stepStatus: status })
			.then(() => {
				if (status !== 4) {
					setStepStatus(status + 1)
				}
				else {
					setStepStatus(1)
				}
				setStartDisabled(false);
			});
	}

	return (
		<Fragment>
			<ProgressOutline state={status} />
			{showResults ? <SettingsModal /> : null}
			<div className='logsBox'>
				<div className='settings'>
					<button className='settingsButton' onClick={onClick}>
						<img className="settingsImage" src='../settings.png'></img>
					</button>
				</div>
				<Logs />
				<div className='SingleStepButtons'>

					<button disabled={startIsDisabled} className='button' id='nextStep' onClick={onNextStep}>
					{!startIsDisabled ? "Next Step" : "Loading..."}
					</button>
					<button disabled={stopIsDisabled} className='button Stop' id='stop' onClick={onStop}>Stop</button>
				</div>
			</div>
		</Fragment >
	);
}


