import React, { Component } from "react";
import socketIOClient from "socket.io-client";


export default class Logs extends Component {
  state = {
    logs: [],
  };


    componentDidMount(){

        let ioClient = socketIOClient.connect("http://localhost:3002");

        ioClient.on("connection",(socket) => {
	    console.log(socket);
	    console.log("connected!");
        });

        ioClient.on("log", (msg)=>{
	    console.log(this);
        this.setState({ logs: [...this.state.logs, msg] }) //simple value
        });
        
    }
  

  
  addNewItem = () => {
    let { logs, input } = this.state;
   
    logs.push(input);
    // this.state.cart.push(this.state.input); // same as above, though bad practice 
  };

  render() {
   return (
      <div>
        
        <ol>
          {this.state.logs.map((subItems, sIndex) => {
            return <li key={sIndex}> {subItems}</li>
          })}
        </ol>
      </div>
    );
  }
}