import React, { Component, Fragment } from "react";
import socketIOClient from "socket.io-client";
import "./style/Buttons.css";
import UrlHandler from "./UrlHandler";

export default class Buttons extends Component  {

	constructor(props) {
		super(props);
		this.state = {
			connButtonText: 'Job not running',
			startIsDisabled: false,
			toggleIsDisabled: false
		  };

		this.toggleJobStatus = this.toggleJobStatus.bind(this);  
		this.startArbitrage = this.startArbitrage.bind(this);
		this.url= UrlHandler();
	}


	componentDidMount() {
	 fetch(this.url+"api/toggleArbitrage",
				{
					method: "get",
				}).then(response => response.json())
				.then(result => {
					if(result) {
						this.setState({connButtonText: 'Job running', startIsDisabled: true});
					}
	
					else {
						this.setState({connButtonText: 'Job not running'});
					}
				});


		let ioClient = socketIOClient.connect(this.url);
	
		ioClient.on("connection", (socket) => {
		  console.log("connected!");
		});
	
		ioClient.on("cycleCompleted", (msg) => { 
		  console.log("cycle completed");
		  this.setState({ toggleIsDisabled:false, startIsDisabled: false}); 
		});
	  
	}

	startArbitrage() {
		this.setState({toggleIsDisabled: true, startIsDisabled: true});
	
		fetch(this.url+"api/singleArbitrage",
			{
				method: "post",
			});
	};

	toggleJobStatus()  {
		if(this.state.connButtonText === 'Job not running') {
			this.setState({connButtonText: 'Job running', startIsDisabled: true});
		}

		else {
			this.setState({connButtonText: 'Job not running', toggleIsDisabled: true});
		}

		fetch(this.url+"api/toggleArbitrage",
			{
				method: "post",
			}).then(response => console.log(response.json()));
	};


	render() {
		return (
			<div className="adminPanel">
		
				<button disabled={this.state.toggleIsDisabled} onClick={this.toggleJobStatus} className="button arbiToggle" id="toggleStatus" title={this.state.toggleIsDisabled ? "Once the job running in the background is finished you can again start a new job run." : "Click here to start a new Job run."}>{this.state.connButtonText}</button>
			</div>
		);
	  }
}
//Single Abitrage button 
//<button disabled={this.state.startIsDisabled} onClick={this.startArbitrage} className="button arbiToggle" id="runSingle" title={this.state.toggleIsDisabled ? "You have to end the currently running job to start a single arbitrage cycle.." : "Click here to start a single arbitrage cycle."}>Run Single Arbitrage Cycle</button>