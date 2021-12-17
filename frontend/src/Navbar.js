import React, { useState } from "react";
import "./Navbar.css";



export default function App() {

    const [show, setShow] = useState(false);

     
    return (
        <div class="topnav">
        <a href="#home" class="active"> <img class="image" src="../bloxmove.png"></img></a>
            <div id="myLinks" style={{ display: show ? "block" : "none" }}>
                <a href="#admin">Admin</a>
            </div>
            
            <button class="icon" onClick={() => setShow((s) => !s)}> 
                <img class="burgerbar" src='../burger_line.png'></img>
            </button>
        </div>
      );
    }
