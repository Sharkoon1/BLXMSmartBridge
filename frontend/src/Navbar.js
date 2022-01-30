import React, { Fragment, useState } from "react";
import "./style/Navbar.css";



export default function App() {

    const [show, setShow] = useState(false);

    //Display Single step 
    function onClick() {
        //####### Abitrage Console Single Step ####### 
        const root1 = document.getElementById("root1");
        //####### Dashboard ####### 
        const root2 = document.getElementById("root2");
        
        const buttons = document.getElementById("buttons");
        const singlestep = document.getElementById("singlestep")
        const fullautonomous = document.getElementById("fullautonomous");
        const dashboard = document.getElementById("dashboard");
       
        //###### Abitrage Console Single Step ####### 
        root1.style.display = "block";
        //####### Dashboard ####### 
        root2.style.display = "none";

        buttons.style.display = "none";
        fullautonomous.classList.remove("topnav-centered-focus");
        singlestep.classList.add("topnav-centered-focus");
        dashboard.classList.remove("topnav-centered-focus"); 

    }

    //Display Dashboard
    function onClick2() {
        //####### Abitrage Console Single Step ####### 
        const root1 = document.getElementById("root1");
        //####### Dashboard ####### 
        const root2 = document.getElementById("root2");

        const buttons = document.getElementById("buttons");
        const singlestep = document.getElementById("singlestep")
        const fullautonomous = document.getElementById("fullautonomous");
        const dashboard = document.getElementById("dashboard");

        singlestep.classList.remove("topnav-centered-focus");
        fullautonomous.classList.remove("topnav-centered-focus");
        dashboard.classList.add("topnav-centered-focus");

        root.style.display = "none";
        root1.style.display = "none";
        buttons.style.display = "none";
        root2.style.display = "block";
    }

    //Display Full Autonomous 
    function onClick3() {
        fullautonomous.classList.add("topnav-centered-focus");
        singlestep.classList.remove("topnav-centered-focus");
        dashboard.classList.remove("topnav-centered-focus");
        
        root1.style.display = "none";
        root2.style.display = "none";
        buttons.style.display = "block";
    }


     
    return (
        <div className="topnav">
            {/* Centered Nav */}
            <div className="topnav-centered">
                <a href="#singlestep" id="singlestep" className="topnav-centered-focus" onClick={onClick}>Single Step</a>
                <a href="#fullautonomous" id="fullautonomous" className="" onClick={onClick3}>Full Autonomous</a>
                <a href="#dashboard" id="dashboard" className="" onClick={onClick2}>Dashboard</a>
            </div>
            
            {/* Left-aligned Image */}
            <img className="imageBig" src="../BloXmove_SmartBridge_Logo_v2.png"></img>
            <img className="imageSmall" src="../BLXMToken.png"></img>
        </div>


      );
    }
