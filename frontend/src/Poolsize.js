import React, { Fragment, useState } from "react";
import "./style/Poolsize.css";

//TODO
//get data
//insert into frontend 

export default function Poolsize() {
    return(
        <div className="displayPoolsizes">
            <h1 className='headingPoolsize'>Poolsize Overview</h1>
            <div className="displayPoolsizeBSC">
                <div className="contentPoolsize">
                    <h1 className="poolsizeSubHeading">Pancakeswap Pool</h1>
                    <div>
                        <span>20000 WETH</span>
                        <span className="and"> | </span>
                        <span>200000000 BXLM</span>
                    </div>
                </div>

            </div>

            <div className="displayPoolsizeETH">
                <div className="contentPoolsize">
                    <h1 className="poolsizeSubHeading">Uniswap Pool</h1>
                    <div>
                        <span>20000 WETH</span>
                        <span className="and"> | </span>
                        <span>200000000 BXLM</span>
                    </div>
                </div>
            </div>
        </div>
    );
    
}