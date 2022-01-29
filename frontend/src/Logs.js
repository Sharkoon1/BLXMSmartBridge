import React, { Component, Fragment } from "react";
import socketIOClient from "socket.io-client";
import Buttons from "./Buttons";
import "./style/Log.css";
import UrlHandler from "./UrlHandler";

export default class Logs extends Component {
  
  messagesEndRef = React.createRef()

  state = {
    logs: []
  };
 

  componentDidMount() {
    let ioClient = socketIOClient.connect(UrlHandler());

    ioClient.on("connection", (socket) => {
      console.log("connected!");
    });

    ioClient.on("log", (msg) => { 
      this.setState({ logs: [...this.state.logs, msg] }); //simple value
      this.scrollToBottom();
    });
  }

  addNewItem = () => {
    let { logs, input } = this.state;

    logs.push(input);
    // this.state.cart.push(this.state.input); // same as above, though bad practice
  };

  onClickRunSingleArbitrageCycleButton = () => { //not working yet
    this.setState({
      text: 'Arbitrage is running...'
    });
  }

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  render() {
    return (
     
    
      <div className="window">
        <div className="terminal">
          <p id="command" className="command">Arbitrage Console is ready.</p>  
            {this.state.logs.map((subItems, sIndex) => {
              return <p className="log"><span key={sIndex}> {subItems}</span></p>;
            })}
          <div ref={this.messagesEndRef} />
        </div>
      </div>
  
    
    );
  }
}
