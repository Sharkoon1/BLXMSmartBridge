import React, { useState, useEffect } from 'react';
import "./style/SettingsModal.css"
import UrlHandler from "./UrlHandler";
import AlertInfo from "./AlertInfo";
import ErrorMessage from './ErrorMessage';
import ToggleSwitch from './ToggleSwitch';
import { get } from "./RequestHandler";
import { post } from "./RequestHandler";
import { blockInvalidChar } from "./utils/BlockInvalidChar"; 
import { decimalValidator } from "./utils/DecimalValidator"; 

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

    return (
        <div className='settingsModal' id='settingsModal'>
            <div className='modalContent'>
                <h1 className='modalHeading'>Settings</h1>
                <div className='modalSettings'>
                        <h1><i>Set Arbitrage Interval </i></h1>
                        <div className='setAbitrageInterval'>
                            <input className='modalInput' type="number" onKeyDown={blockInvalidChar}></input>
                            <button className='modalButton'>Apply</button>
                        </div>


                        {/*Set Slippage Percentage */}
                        <hr id='setttingsHr'></hr>
                        <div className='setSlippage'> 
                            <h1><i>Set Slippage Percentage</i></h1>
                            <div> 
                                <div>
                                    <span className='modalSubHeading'>ETH</span>
                                    <input className='modalInput' type="number" onKeyDown={blockInvalidChar} onChange={e => {  if(decimalValidator(e, 100)) setSlippageEth(e.target.value) }} value={slippageEth}></input>
                                </div> 
 
                                <div>
                                    <span className='modalSubHeading'>BSC</span>
                                    <input className='modalInput' type="number" onKeyDown={blockInvalidChar} onChange={e => { if(decimalValidator(e, 100)) setSlippageBsc(e.target.value) }} value={slippageBsc}></input>
                                </div> 
                                <button className='modalButton' onClick={apply}>Apply</button>
                        </div>       

                        {/*Set Max Swap Amount */}
                        <hr id='setttingsHr'></hr>
                        <div className='setMaxSwapAmount'>
                            <h1><i>Set Max Swap Amount</i></h1> 
                            <ToggleSwitch setAlert={setAlert} setError={setError}/>
                        </div>  
                        
                        {/*Alerts */}
                        <AlertInfo className="alertInfo" message={alert}></AlertInfo>
                        <ErrorMessage message={error}></ErrorMessage>
                        
                    </div>
                </div>           
            </div>         
        </div>
    );
}

