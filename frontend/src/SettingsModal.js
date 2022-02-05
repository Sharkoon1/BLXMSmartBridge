import React, { useState, useEffect } from 'react';
import "./style/SettingsModal.css"
import UrlHandler from "./UrlHandler";
import AlertInfo from "./AlertInfo";
import ErrorMessage from './ErrorMessage';
import { get } from "./RequestHandler";
import { post } from "./RequestHandler";

export default function SettingsModal() {
    var url = UrlHandler();
    const [alert, setAlert] = useState();
    const [error, setError] = useState();
    
    const [slippageEth, setSlippageEth] = useState(0);
    const [slippageBsc, setSlippageBsc] = useState(0);


    useEffect(() => {   
        get(url +"api/slippage/").then(result => {
            if(result.data.slippage) {
                setSlippageBsc(result.data.slippage.bsc);
                setSlippageEth(result.data.slippage.eth);
             }
         });
     }, []);

    function apply() {
        post(url+"api/slippage/", {slippageEth:parseInt(slippageEth), slippageBsc: parseInt(slippageBsc)}).then(response => {
            if(response.status === 1) {
                setAlert("Success!");
            } else {
                setError("An error occured. Response code: " + response.status)
            }
            });
    }

    function onChangeBsc(e){
        const re = /^[0-9\b]+$/;
        if (re.test(e.target.value)) {
            setSlippageBsc(e.target.value);
        }    
    }

    function onChangeEth(e){
        const re = /^[0-9\b]+$/;
        if (re.test(e.target.value)) {
            setSlippageEth(e.target.value);
        }    
    }


    return (
        <div className='settingsModal' id='settingsModal'>
            <div className='modalContent'>
                <h1 className='modalHeading'>Settings</h1>
                <div className='modalSettings'>
                    <h1>Set Slippage </h1>
                    <div> 
                        <div>
                            <span className='modalSubHeading'>ETH</span>
                            <input className='modalInput' type="number"  onChange={onChangeEth} placeholder={slippageEth}></input>
                        </div> 

                        <div>
                            <span className='modalSubHeading'>BSC</span>
                            <input className='modalInput' type="number" onChange={onChangeBsc} placeholder={slippageBsc}></input>
                        </div> 
                        
                        <AlertInfo className="alertInfo" message={alert}></AlertInfo>
                        <ErrorMessage message={error}></ErrorMessage>
                        <button className='modalButton' onClick={apply}>Apply</button>
                    </div>
                    

                </div>           
            </div>         
        </div>
    );
}

