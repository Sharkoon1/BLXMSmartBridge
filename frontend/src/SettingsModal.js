import React, { useState, useEffect } from 'react';
import "./style/SettingsModal.css"
import UrlHandler from "./UrlHandler";
import AlertInfo from "./AlertInfo";

export default function SettingsModal() {
    var url = UrlHandler();
    const [alert, setAlert] = useState();
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
        console.log(setSlippage);
        fetch(url+"api/slippage/",
        {
            headers: { "Content-Type": "application/json" },
            method: "post",
            body: JSON.stringify({slippageWindow:slippageWindow})
        }).then(response => {
            if(response) {
                setAlert("Success! New slippage window is " + slippageWindow + " min");
            }
            })
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
                        <AlertInfo message={alert}></AlertInfo>
                    </div>
                    
                </div>           
            </div>         
        </div>
    );
}

