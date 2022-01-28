import React, { Component, Fragment, useEffect} from 'react';
import Logs from './Logs';
import "./style/SingleStep.css"
import SettingsModal from './SettingsModal';
import UrlHandler from "./UrlHandler";
import ProgressOutline from './ProgressOutline';

export default function SingleStep() {
    var url = UrlHandler();

    const [stopIsDisabled, setStopDisabled] = React.useState(false)
    const [startIsDisabled, setStartDisabled] = React.useState(false)
    const [status, setStepStatus] = React.useState(1)
    const [showResults, setShowResults] = React.useState(false)
    const onClick = () => setShowResults(!showResults)

    useEffect(() => {
        fetch(url +"api/arbitrage/stepStatus",
        {
            method: "get",
        }).then(response => response.json())
        .then(result => {
            if(result.data.stepStatus) {
                setStepStatus(result.data.stepStatus);
            }
        });
    }, []);

    function onStop() {
        setStopDisabled(true);
        setStepStatus(1);

        fetch(url+"api/arbitrage/stopStep",
        {
            headers: { "Content-Type": "application/json" },
            method: "post"
        }).then(response => response.json())
        .then(() => {
            setStopDisabled(false);
        }); 
    }

    function onNextStep() {
        setStartDisabled(true);
        fetch(url+"api/arbitrage/singleStep", 
        {
            headers: { "Content-Type": "application/json" },
            method: "post",
            body: JSON.stringify({stepStatus:status})
        }).then(response => response.json())
        .then(() => {         
            if(status !== 4) {
                setStepStatus(status+1)
            }
            else {
                setStepStatus(1)
            }
            setStartDisabled(false);
        });
    }
 
    return (
        <Fragment>
        <ProgressOutline state={status}/>
        { showResults ? <SettingsModal/> : null }
            <div className='logsBox'>
                <div className='settings'>
                    <button className='settingsButton' onClick={onClick}>
                        <img className="settingsImage" src='../settings.png'></img>
                    </button>
                </div> 
                <Logs/>
                <div className='SingleStepButtons'>
                    <button disabled={startIsDisabled} className='button' id='nextStep' onClick={onNextStep}>Next Step</button>
                    <button disabled={stopIsDisabled} className='button Stop' id='stop' onClick={onStop}>Stop</button>
                </div>
            </div> 

        </Fragment>
    );
}


