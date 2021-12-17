import React, { useState } from "react";
import "./style/Navbar.css";



export default function App() {

    const [show, setShow] = useState(false);

     
    return (
        <div class="topnav">
        <a href="" class="active"> <img class="image" src="../bloxmove.png"></img></a>
            <div id="myLinks" style={{ display: show ? "block" : "none" }}>
                <a href="#admin">Admin</a>
            </div>
            
            <button class="icon" onClick={() => setShow((s) => !s)}> 
                <img class="burgerbar" src='../burger_line.png'></img>
            </button>
        </div>
      );
    }
