import React, { Component, Fragment } from 'react';
import Logs from './Logs';
import "./style/SingleStep.css"
import Buttons from "./Buttons";


export default function FullAutonomous() {
    

    
    
    function showSettings() {
        var modal = document.getElementById("myModal");

    
    }




 
    return (
      

            <div className='logsBox'>
                <div className='settings'>
                    
                    <button className='settingsButton'>
                        <img className="settingsImage" src='../settings.png'></img>
                    </button>
                </div> 

                <Logs/>
                <Buttons/>
                <div style={{paddingBottom:  '20px'}}></div>
            </div> 

    );
}


