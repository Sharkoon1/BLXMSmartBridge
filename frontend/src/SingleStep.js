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
	const [engaged, setEngagement] = React.useState(false)

	useEffect(() => {
		get(url + "api/arbitrage/stepStatus").then(result => {
				if (result.data.stepStatus) {
					setStepStatus(result.data.stepStatus);
				}
			});
	}, []);

	function onStop() {
		setStopDisabled(true);
		setEngagement(!engaged);
		setStepStatus(1);

		post(url + "api/arbitrage/stopStep").then(() => {
				setStopDisabled(false);
			});
	}

	function onNextStep() {
		if (!engaged){
			setEngagement(!engaged);
		}
		setStartDisabled(true);
		post(url + "api/arbitrage/singleStep", { stepStatus: status })
			.then((res) => {
				setStepStatus(res.data.stepStatus)
				setStartDisabled(false);
				if (status===1 || status===3){
					setEngagement(!engaged);
				}
			});
	}

	return (
		<Fragment>
			<ProgressOutline state={status} engaged={engaged} />
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
					{!startIsDisabled ? (!engaged ? "Start Arbitrage" : "Next Step") : "Loading..."}
					</button>
					<button disabled={stopIsDisabled} className='button Stop' id='stop' onClick={onStop}>Stop</button>
				</div>
			</div>
		</Fragment >
	);
}


