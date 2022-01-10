import React, { useState } from "react";
import "./style/Navbar.css";



export default function App() {

    const [show, setShow] = useState(false);

    function onClick() {
        const root = document.getElementById("root");
        const root1 = document.getElementById("root1");
        const buttons = document.getElementById("buttons");
        const singlestep = document.getElementById("singlestep")
        const fullautonomous = document.getElementById("fullautonomous");
        const dashboard = document.getElementById("dashboard");
       


        if(root.style.display === "none" || root1.style.display === "none") {
            root.style.display = "block";
            root1.style.display = "block";
            buttons.style.display = "none";
            fullautonomous.classList.remove("topnav-centered-focus");
            singlestep.classList.add("topnav-centered-focus");
            dashboard.classList.remove("topnav-centered-focus");
        }
        
        else {
            fullautonomous.classList.add("topnav-centered-focus");
            singlestep.classList.remove("topnav-centered-focus");
            dashboard.classList.remove("topnav-centered-focus");
            root.style.display = "none";
            root1.style.display = "none";
            buttons.style.display = "block";
        }
    }

    function onClick2() {
        const root = document.getElementById("root");
        const root1 = document.getElementById("root1");
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
        
    }


     
    return (
        <div className="topnav">
        
        {/* Centered Nav */}
        <div className="topnav-centered">
                <a href="#singlestep" id="singlestep" className="topnav-centered-focus" onClick={onClick}>Single Step</a>
                <a href="#fullautonomous" id="fullautonomous" className="" onClick={onClick}>Full Autonomous</a>
                <a href="#dashboard" id="dashboard" className="" onClick={onClick2}>Dashboard</a>
            </div>
            
        {/* Left-aligned Image */}
        
            <img className="image" src="../Bloxmove-Logo.png"></img>
     
         
     
        </div>

      );
    }
