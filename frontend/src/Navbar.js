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

     
    return (
        <div class="topnav">
        <a href="" class="active"> <img class="image" src="../bloxmove.png"></img></a>
            <div id="myLinks" style={{ display: show ? "block" : "none" }}>
                <button id="adminButton" onClick={onClick}>Admin</button>
            </div>
            
            <button class="icon" onClick={() => setShow((s) => !s)}> 
                <img class="burgerbar" src='../burger_line.png'></img>
            </button>
        </div>
      );
    }
