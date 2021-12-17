import react, {Component} from "react";
import ListGroup from 'react-bootstrap/listgroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style/Log.scss";
import socketIOClient from "socket.io-client";

let ioClient = socketIOClient.connect("http://localhost:3002");

ioClient.on("connection",(socket) => {
	console.log(socket);
	console.log("connected!");
});

ioClient.on("log", function(msg){
	console.log(msg);
});

export class Log extends Component{

    render(){
        return(
<div class="window">
  <div class="terminal">
    <p class="command">git clone https://github.com/schacon/ticgit</p>
    <p class="log">
      <span>

      </span>
    </p>
  </div>
</div>      

        )
    }
}