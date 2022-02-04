import React, { StrictMode, Component, Fragment } from "react";
import "./style/LoginPage.css"

import ReactDOM from "react-dom";

import "./style/index.css"
import "./style/App.css";
import App from "./App";
import App1 from "./App1";
import Navbar from "./Navbar";
import Logs from "./Logs";
import Buttons from "./Buttons";
import SingleStep from "./SingleStep"
import FullAutonomous from "./FullAutonomous";
import AlertInfo from "./AlertInfo";
import ErrorMessage from "./ErrorMessage";
import ProgressOutline from "./ProgressOutline";
import { post } from "./RequestHandler";

import Dashboad from "./Dashboad";
import UrlHandler from "./UrlHandler";
//import LoginPage from "./LoginPage";

const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
        window.ethereum.request({ method: "eth_requestAccounts" })
            .then(result => {
                post(UrlHandler() + "api/authorization", { User: result[0] }).then(result => {
                        debugger;
                        if (result.status === 1) {
                            //####### NAVBAR #######
                            const navbar = document.getElementById("navbar");
                            ReactDOM.render(
                                <StrictMode>
                                    <Navbar />
                                </StrictMode>,
                                navbar
                            );

                            //####### Abitrage Console Full Autonomous ####### 
                            const rootElement2 = document.getElementById("buttons");
                            ReactDOM.render(
                                <StrictMode>
                                    <FullAutonomous />
                                </StrictMode>,
                                rootElement2
                            );

                            //####### Abitrage Console Single Step ####### 

                            ReactDOM.render(
                                <StrictMode>
                                    <SingleStep />
                                </StrictMode>,
                                rootElement1
                            );

                            //####### Dashboard ####### 
                            const dashboardGraph = document.getElementById("root2");
                            ReactDOM.render(
                                <StrictMode>
                                    <Dashboad />
                                </StrictMode>,
                                dashboardGraph
                            );
                        } else {
                            //TODO
                            const alertWindow = document.getElementsByClassName("alert-info");
                            console.log(alertWindow);
                            alertWindow.style.display("block");
                        }
                    });
            })
            .catch(error => {
                const ErrorMessage = document.getElementById("root");
                ReactDOM.render(
                    <StrictMode>
                        <AlertInfo message={error.message} />
                    </StrictMode>,
                    ErrorMessage
                );
            });

    } else {
        console.log("Need to install MetaMask");
    }
}


function LoginPage() {
    return (
        <Fragment>
            <div className="empty"></div>
            <div className="loginPage">
                <img className="logoBLXM" src="../BLXMToken.png"></img>
                <h1 className="textLogin">Welcome to BLXM Smartbridge!!!</h1>
                <h1 className="textLogin">Login to enter admin view</h1>
                <button className="button" id="loginButton" onClick={connectWalletHandler}>Login with MetaMask</button>
            </div>
            <AlertInfo message={"You are not authorized to access this website."} />
            <ErrorMessage message={"An error occured"}/>
        </Fragment>
    );
}

const rootElement1 = document.getElementById("root1");
ReactDOM.render(
    <StrictMode>
        <LoginPage />
    </StrictMode>,
    rootElement1);
