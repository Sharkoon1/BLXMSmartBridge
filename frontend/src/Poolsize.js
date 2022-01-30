import React, { Component } from "react";
import UrlHandler from "./UrlHandler";
import axios from 'axios';
const url = UrlHandler();
import "./style/Poolsize.css";

export default class Poolsize extends Component {

	constructor(props) {
		super(props)
		this.state = {
			PancakeswapBNB: "Loading...",
			PancakeswapBLXM: "Loading...",
			UniswapETH: "Loading...",
			UniswapBLXM: "Loading...",
			BSCStableName: "Loading...",
			BSCBasicName: "Loading...",
			ETHStableName: "Loading...",
			ETHBasicName: "Loading..."
		}
	}
	componentDidMount() {
		axios.get(url + "api/oracle/poolsize ").then((res) => {
			this.setState(prevState => {
				return {
					PancakeswapBNB: res.data.data.PancakeswapStable,
					PancakeswapBLXM: res.data.data.PancakeswapBLXM,
					UniswapETH: res.data.data.UniswapStables,
					UniswapBLXM: res.data.data.UniswapBLXM,
					BSCStableName: res.data.data.NameBSCStable,
					BSCBasicName: res.data.data.NameBSCBasic,
					ETHStableName: res.data.data.NameETHStable,
					ETHBasicName: res.data.data.NameETHBasic
				};
			});
		});
	}

	render() {
		return (
			<div className="displayPoolsizes">
				<h1 className='headingPoolsize'>Poolsize Overview</h1>
				<div className="displayPoolsizeBSC">
					<div className="contentPoolsize">
						<h1 className="poolsizeSubHeading">Pancakeswap Pool</h1>
						<div>
							<span>{this.state.PancakeswapBNB} {this.state.BSCStableName}</span>
							<span className="and"> | </span>
							<span>{this.state.PancakeswapBLXM} {this.state.BSCBasicName}</span>
						</div>
					</div>

				</div>

				<div className="displayPoolsizeETH">
					<div className="contentPoolsize">
						<h1 className="poolsizeSubHeading">Uniswap Pool</h1>
						<div>
							<span>{this.state.UniswapETH} {this.state.ETHStableName}</span>
							<span className="and"> | </span>
							<span>{this.state.UniswapBLXM} {this.state.ETHBasicName}</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}