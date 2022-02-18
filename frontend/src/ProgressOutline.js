import React, { Component} from 'react';
import "./style/ProgressOutline.css"


export default function ProgressOutline(props) {

    return (
        <div className='progressOutline'>
           <div className='headline'>
               <h1>Progress Outline</h1>
               <hr className='underline'></hr>
           </div>
           <div className='content'>
                <ul class="progressbar">
                    {/* Step1 is when abitrage cycle isn't running*/}
                    <li id='progressbar2' className={props.state === 2 ? "active" : null}>Price Collection</li>
                    <li id='progressbar2' className={props.state === 3 ? "active" : null}>Arbitrage Calculation</li>
                    <li id='progressbar2' className={props.state === 4 ? "active" : null}>Execute Swap</li>
                </ul>
           </div>
        </div>
    );
}