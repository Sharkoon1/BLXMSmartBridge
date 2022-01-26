import React, { Component, Fragment, useEffect} from 'react';
import Logs from './Logs';
import "./style/SingleStep.css"
import SettingsModal from './SettingsModal';


export default function SingleStep() {

    useEffect(() => {
        fetch(url +"api/arbitrage/singleStep",
        {
            method: "get",
        }).then(response => response.json())
        .then(result => {
            if(result.data.stepStatus) {
                setStepStatus(result.data.stepStatus);
            }
        });
    });

    function onStop() {
        setStepStatus(1);

        fetch(url+"api/arbitrage/setStep",
        {
            headers: { "Content-Type": "application/json" },
            method: "post",
            body: JSON.stringify({stepStatus:status})
        }).then(response => response.json())
        .then(result => {
            
        });
    }

    function onNextStep() {
        if(status !== 4) {
            setStepStatus(status + 1)
        }
        else {
            setStepStatus(1);
        }

        fetch(url+"api/arbitrage/step",
        {
            headers: { "Content-Type": "application/json" },
            method: "post",
            body: JSON.stringify({stepStatus:status})
        }).then(response => response.json())
        .then(result => {
            
        });
    }
    
    const [status, setStepStatus] = React.useState(1)
    const [showResults, setShowResults] = React.useState(false)
    const onClick = () => setShowResults(!showResults)
 
    return (
        <Fragment>
        { showResults ? <SettingsModal/> : null }
            <div className='logsBox'>
                <div className='settings'>
                    <button className='settingsButton' onClick={onClick}>
                        <img className="settingsImage" src='../settings.png'></img>
                    </button>
                </div> 
                <Logs/>
                <div className='SingleStepButtons'>
                    <button className='button' id='nextStep' onClick={onNextStep}>Next Step</button>
                    <button className='button Stop' id='stop' onClick={onStop}>Stop</button>
                </div>
            </div> 

        </Fragment>
    );
}


