import React, { useState, useEffect } from 'react';
import "./style/SettingsModal.css"
import UrlHandler from "./UrlHandler";
import AlertInfo from "./AlertInfo";
import ErrorMessage from './ErrorMessage';

export default function SettingsModal() {
    var url = UrlHandler();
    const [alert, setAlert] = useState();
    const [error, setError] = useState();
    const [slippageEth, setSlippageEth] = useState(0);
    const [slippageBsc, setSlippageBsc] = useState(0);

    useEffect(() => {   
        fetch(url +"api/slippage/",
        {
            method: "get",
        }).then(response => response.json())
        .then(result => {
            if(result.data.slippage) {
                setSlippageBsc(result.data.slippage.bsc);
                setSlippageEth(result.data.slippage.eth);
             }
         });
     }, []);

    function apply() {
        fetch(url+"api/slippage/",
        {
            headers: { "Content-Type": "application/json" },
            method: "post",
            body: JSON.stringify({slippageEth:parseInt(slippageEth), slippageBsc: parseInt(slippageBsc)},)
        }).then(response => {
            if(response.status === 200) {
                setAlert("Success! New slippage percentage are set.");
            } else {
                setError("An error occured. Response code: " + response.status)
            }
            });
    }

    return (
        <div className='settingsModal' id='settingsModal'>
            <div className='modalContent'>
                <h1 className='modalHeading'>Settings</h1>
                <div className='modalSettings'>
                    <h1>Set Slippage </h1>
                    <div>   
                        <span>ETH</span>
                        <input className='modalInput' onInput={e => setSlippageEth(e.target.value)} placeholder={slippageEth}></input>
                        <span>BSC</span>
                        <input className='modalInput' onInput={e => setSlippageBsc(e.target.value)} placeholder={slippageBsc}></input>
                        <AlertInfo message={alert}></AlertInfo>
                        <ErrorMessage message={error}></ErrorMessage>
                        
                    </div>
                    <button className='modalButton' onClick={apply}>Apply</button>

                </div>           
            </div>         
        </div>
    );
}

