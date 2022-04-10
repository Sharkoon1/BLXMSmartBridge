import React, { Fragment } from 'react';
import Logs from './Logs';
import "./style/SingleStep.css"
import Buttons from "./Buttons";
import SettingsModal from './SettingsModal';


export default function FullAutonomous() {

    const [showResults, setShowResults] = React.useState(false)
    const onClick = () => setShowResults(!showResults)
    
   

 
    return (
      <Fragment>
          { showResults ? <SettingsModal/> : null }
            <div className='logsBox'>
                <div className='settings'>
                    <button className='settingsButton' onClick={onClick} >
                        <img className="settingsImage" src='../settings.png'></img>
                    </button>
                </div> 
                <Logs/>
                <Buttons/>
                <div style={{paddingBottom:  '20px'}}></div>
            </div> 
        </Fragment>
    );
}


