import React, { Component, Fragment } from "react";
import socketIOClient from "socket.io-client";
import "./style/Buttons.css";

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
	}


	componentDidMount() {

	 fetch("http://localhost:3001/api/toggleArbitrage",
				{
					method: "get",
				}).then(response => response.json())
				.then(result => {
					if(result) {
						this.setState({connButtonText: 'Job running'});
					}
	
					else {
						this.setState({connButtonText: 'Job not running'});
					}
				});


		let ioClient = socketIOClient.connect("http://localhost:3002");
	
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
	
		fetch("http://localhost:3001/api/singleArbitrage",
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

		fetch("http://localhost:3001/api/toggleArbitrage",
			{
				method: "post",
			}).then(response => console.log(response.json()));
	};


	render() {
		return (
			<div className="adminPanel">
				<button disabled={this.state.startIsDisabled} onClick={this.startArbitrage} className="button arbiToggle" id="runSingle" >Run Single Arbitrage Cycle</button>
				<button disabled={this.state.toggleIsDisabled} onClick={this.toggleJobStatus} className="button arbiToggle" id="toggleStatus">{this.state.connButtonText}</button>
			</div>
		);
	  }
}