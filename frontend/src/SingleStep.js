import React, { Component, Fragment } from 'react';
import Logs from './Logs';
import "./style/SingleStep.css"

//Function Job not running -> Step running 
//Styling 

export default class SingleStep extends Component {
    render() {
        return (
            <Fragment>
                <Logs/>
                <div className='SingleStepButtons'>
                    <button className='button' id='nextStep'>Next Step</button>
                    <button className='button Stop' id='stop'>Stop</button>
                </div>

            </Fragment>
        );
    }
}

