import React, { Component, Fragment } from "react";
import socketIOClient from "socket.io-client";
import "./style/Buttons.css";
import UrlHandler from "./UrlHandler";
import { get, post } from "./RequestHandler";

export default class Buttons extends Component  {

	constructor(props) {
		super(props);
		this.state = {
			connButtonText: 'Job not running',
			startIsDisabled: false,
			toggleIsDisabled: false,
			isRunning: false
		  };

		this.toggleJob = this.toggleJob.bind(this);  
		this.url= UrlHandler();
	}


	componentDidMount() {
		get(this.url+"api/arbitrage/status").then(result => {
					if(result.data.ArbitrageCycleStatus) {
						this.setState({connButtonText: 'Job running', isRunning: true});
					}
	
					else {
						this.setState({connButtonText: 'Job not running', isRunning: false});
					}
				});


		let ioClient = socketIOClient.connect(this.url);
	
		ioClient.on("connection", (socket) => {
		  console.log("connected!");
		});
	
		ioClient.on("cycleCompleted", (msg) => { 
		  console.log("cycle completed");
		  this.setState({ connButtonText: 'Job not running', toggleIsDisabled: false, isRunning: false}); 
		});
	  
	};

	toggleJob()  {
		if(this.state.isRunning) {
			this.setState({connButtonText: 'Stopping - waiting for cycle to complete', toggleIsDisabled: true, isRunning: false});
		}

		else {
			this.setState({connButtonText: 'Job running', isRunning: true});
		}

		post(this.url+"api/arbitrage/toggle",{});
	};


	render() {
		return (
			<div className="adminPanel">
				<button disabled={this.state.toggleIsDisabled} onClick={this.toggleJob} className="button arbiToggle" id="toggleStatus" title={this.state.toggleIsDisabled ? "Once the job running in the background is finished you can again start a new job run." : "Click here to start a new Job run."}>{this.state.connButtonText}</button>
			</div>
		);
	  }
}