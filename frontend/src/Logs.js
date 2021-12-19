import React, { Component, Fragment } from "react";
import socketIOClient from "socket.io-client";
import Buttons from "./Buttons";

export default class Logs extends Component {
  state = {
    logs: [],
  };
 

  componentDidMount() {
    let ioClient = socketIOClient.connect("http://localhost:3020");

    ioClient.on("connection", (socket) => {
      console.log(socket);
      console.log("connected!");
    });

    ioClient.on("log", (msg) => {
      console.log(this);
      this.setState({ logs: [...this.state.logs, msg] }); //simple value
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
    console.log("test");
  }

  render() {
    return (
      <Fragment>
   
      <div class="window">
        <div class="terminal">
          <p id="command" class="command">Arbitrage Console is ready.</p>  
            {this.state.logs.map((subItems, sIndex) => {
              return <p class="log"><span key={sIndex}> {subItems}</span></p>;
            })}
          
        </div>
      </div>
      <Buttons />
      </Fragment>
    );
  }
}
