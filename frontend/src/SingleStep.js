import React, { Component, Fragment } from 'react';
import Logs from './Logs';
import "./style/SingleStep.css"
import SettingsModal from './SettingsModal';


export default function SingleStep() {
    
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
                    <button className='button' id='nextStep'>Next Step</button>
                    <button className='button Stop' id='stop'>Stop</button>
                </div>
            </div> 

        </Fragment>
    );
}


