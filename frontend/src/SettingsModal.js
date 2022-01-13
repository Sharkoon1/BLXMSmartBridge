import React from 'react';
import "./style/SettingsModal.css"

export default function SettingsModal() {
    return (
        <div className='settingsModal' id='settingsModal'>
            <div className='modalContent'>
                <h1 className='modalHeading'>Settings</h1>
                <div className='modalSettings'>
                    <h1>Set Slippage Window </h1>
                    <div>
                        <button className='modalButton'>Apply</button>
                        <input className='modalInput' placeholder='30'></input>
                        <span>Minutes</span>
                    </div>

                </div> 

            
            </div>
          
        </div>
    );
}

