import React, { useState, useEffect } from 'react';
import "./style/SettingsModal.css"
import UrlHandler from "./UrlHandler";
import AlertInfo from "./AlertInfo";
import ErrorMessage from './ErrorMessage';
import ToggleSwitch from './ToggleSwitch';
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
        post(url+"api/slippage/", {slippageEth:parseFloat(slippageEth), slippageBsc: parseFloat(slippageBsc)}).then(response => {
            if(response.status === 1) {
                setAlert("Successfully set slippage percentage!");

                setTimeout(() => { setAlert(null); }, 3000);

            } else {
                setError("An error occured. Response code: " + response.status)

                setTimeout(() => { setError(null); }, 3000);
            }
        });
    }

    function onChangeBsc(e){
        // regex to only allow 1 to 100 percent slippage.
        const re = /^(?!0\d)\d{1,2}(\.\d{1,2})?$/;
        if (re.test(e.target.value)) {
            setSlippageBsc(e.target.value);
            setAlert(null);
        }  
    }

    function onChangeEth(e){
        // regex to only allow 1 to 100 percent slippage.
        const re = /^(?!0\d)\d{1,2}(\.\d{1,2})?$/;
        if (re.test(e.target.value)) {
            setSlippageEth(e.target.value);
            setAlert(null);
        }    
    }


    return (
        <div className='settingsModal' id='settingsModal'>
            <div className='modalContent'>
                <h1 className='modalHeading'>Settings</h1>
                <div className='modalSettings'>
                        <div className='setSlippage'> 
                            <h1><i>Set Slippage Percentage</i></h1>
                            <div> 
                                <div>
                                    <span className='modalSubHeading'>ETH</span>
                                    <input className='modalInput' type="number"  onChange={onChangeEth} value={slippageEth}></input>
                                </div> 

                                <div>
                                    <span className='modalSubHeading'>BSC</span>
                                    <input className='modalInput' type="number" onChange={onChangeBsc} value={slippageBsc}></input>
                                </div> 
                                <button className='modalButton' onClick={apply}>Apply</button>
                        </div>       
                        <hr id='setttingsHr'></hr>
                        <div className='setMaxSwapAmount'>
                            <h1><i>Set Max Swap Amount</i></h1> 
                            <ToggleSwitch setAlert={setAlert} setError={setError}/>
                        </div>  
                        
                        <AlertInfo className="alertInfo" message={alert}></AlertInfo>
                        <ErrorMessage message={error}></ErrorMessage>
                        
                    </div>
                </div>           
            </div>         
        </div>
    );
}

