import React, { Fragment, useState } from "react";

//Todo
//get data
//insert to frontend


export default function WalletOverview() {
    return(
        <div className="displayPoolsizes">
            <h1 className='headingPoolsize'>Abitrage Liquidity Overview</h1>
                <div className="abitrageWallet">
                    <div className="contentPoolsize">
                        <h1 className="poolsizeSubHeading">Abitrage Wallet</h1>
                        <div>
                            <span>2.23131324421 ETH </span>
                            <span className="and"> | </span>
                            <span>4.81182941240 BNB</span>
                        </div>
                    </div>
                </div>

                <div className="displayPoolsizeBSC">
                    <div className="contentPoolsize">
                        <h1 className="poolsizeSubHeading">Binance Smart Chain</h1>
                        <div>
                            <span>20000 WETH </span>
                            <span className="and"> | </span>
                            <span>200000000 BXLM</span>
                        </div>
                    </div>

                </div>

                <div className="displayPoolsizeETH">
                    <div className="contentPoolsize">
                        <h1 className="poolsizeSubHeading">Ethereum</h1>
                        <div>
                            <span>20000 WETH</span>
                            <span className="and"> | </span>
                            <span>200000000 BXLM </span>
                        </div>
                    </div>
                </div>
        </div>
    );
    
}