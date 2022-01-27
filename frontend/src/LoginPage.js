import React, { Component, Fragment } from "react";
import "./style/LoginPage.css"

export default function LoginPage() {

    return(
        <Fragment>
            <div className="empty"></div>
            <div className="loginPage">
                <img className="logoBLXM" src="../BLXMToken.png"></img>
                <h1 className="textLogin">Welcome to BLXM Smartbridge!!!</h1>
                <h1 className="textLogin">Login to enter admin view</h1>
                <button className="button" id="loginButton">Login with MetaMask</button>
            </div>
        </Fragment>
    );
    
}