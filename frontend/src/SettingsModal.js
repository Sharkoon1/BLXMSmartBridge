import React, { useState, useEffect } from 'react';
import "./style/SettingsModal.css"
import UrlHandler from "./UrlHandler";

export default function SettingsModal() {
    var url = UrlHandler();
    const [slippageWindow, setSlippage] = useState(0);

    useEffect(() => {   

        fetch(url +"api/slippage/",
        {
            method: "get",
        }).then(response => response.json())
        .then(result => {
            if(result.data.SlippageWindow) {
                setSlippage(result.data.SlippageWindow);
            }
        });
    });

    function apply() {
        fetch(url+"api/slippage/",
        {
            headers: { "Content-Type": "application/json" },
            method: "post",
            body: JSON.stringify({slippageWindow:slippageWindow})
        }).then(response => response.json())
        .then(result => {
            
        });
    }

    return (
        <div className='settingsModal' id='settingsModal'>
            <div className='modalContent'>
                <h1 className='modalHeading'>Settings</h1>
                <div className='modalSettings'>
                    <h1>Set Slippage Window </h1>
                    <div>
                        <button className='modalButton' onClick={apply}>Apply</button>
                        <input className='modalInput' placeholder={slippageWindow}></input>
                        <span>Minutes</span>
                    </div>
                </div>           
            </div>         
        </div>
    );
}

