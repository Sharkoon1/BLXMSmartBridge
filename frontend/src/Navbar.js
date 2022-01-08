import React, { useState } from "react";
import "./style/Navbar.css";



export default function App() {

    const [show, setShow] = useState(false);

    function onClick() {
        const root = document.getElementById("root");
        const root1 = document.getElementById("root1");
        const buttons = document.getElementById("buttons");


        if(root.style.display === "none" || root1.style.display === "none") {
            root.style.display = "block";
            root1.style.display = "block";
            buttons.style.display = "none";
        }
        
        else {
            root.style.display = "none";
            root1.style.display = "none";
            buttons.style.display = "block";
        }
    }

    function onClick2() {
        const root = document.getElementById("root");
        const root1 = document.getElementById("root1");
        const buttons = document.getElementById("buttons");

        root.style.display = "block";
        root1.style.display = "block";
        buttons.style.display = "none";
        
    }


     
    return (
        <div className="topnav">
        <a href="" className="active" onClick={onClick2}> <img className="image" src="../Bloxmove-Logo.png"></img></a>
            <div id="myLinks" style={{ display: show ? "block" : "none" }}>
              <a href="#singlestep" onClick={onClick}>Single Step</a>
              <a href="#fullautonomous" onClick={onClick}>Full Autonomous</a>
            </div>
            
            <button className="icon" onClick={() => setShow((s) => !s)}> 
                <img className="burgerbar" src='../burger_line.png'></img>
            </button>
        </div>
      );
    }
