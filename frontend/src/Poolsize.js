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
			bscStableName: "",
			bscBasicName: "",
			ethStableName: "",
			ethBasicName: "",
			poolAddressEth: "",
			poolAddressBsc: ""
		}
	}
	componentDidMount() {
		fetch(url + "api/oracle/poolData ").then(res => res.json())
										   .then(result => {
			this.setState(prevState => {
				return {
					PancakeswapBNB: result.data.liquidities.PancakeswapStable,
					PancakeswapBLXM: result.data.liquidities.PancakeswapBLXM,
					UniswapETH: result.data.liquidities.UniswapStables,
					UniswapBLXM: result.data.liquidities.UniswapBLXM,
					bscStableName: result.data.bscStableName,
					bscBasicName: result.data.bscBasicName,
					ethStableName: result.data.ethStableName,
					ethBasicName: result.data.ethBasicName,
					poolAddressEth: result.data.poolAddresses.liquidityPoolEth,
					poolAddressBsc: result.data.poolAddresses.liquidityPoolBsc
				};
			});
		});
	}

	render() {
		return (
			<div className="displayPoolsizes">
				<h1 className='headingPoolsize'>Liquidity Pool Overview</h1>
				<div className="displayPoolsizeBSC">
					<div className="contentPoolsize">
					<h1 className="textPoolsize">
						<span className="poolsizeSubHeading">Pancakeswap Pool </span>
						<span className="displayPoolAddress">{this.state.poolAddressBsc}</span>
						<button className="poolsizeButton">
							<img className="poolsizeButtonPicture" src="../copy2.png"></img>
						</button>
					</h1>
							<div>
								<span>{this.state.PancakeswapBNB} {this.state.bscStableName}</span>
								<span className="and"> | </span>
								<span>{this.state.PancakeswapBLXM} {this.state.bscBasicName}</span>
							</div>
					</div>

				</div>

				<div className="displayPoolsizeETH">
					<div className="contentPoolsize">
						<h1 className="textPoolsize">
							<span className="poolsizeSubHeading">Uniswap Pool </span>
							<span className="displayPoolAddress">{this.state.poolAddressEth}</span>
							<button className="poolsizeButton">
								<img className="poolsizeButtonPicture" src="../copy2.png"></img>
							</button>
						</h1>
						<div>
							<span>{this.state.UniswapETH} {this.state.ethStableName}</span>
							<span className="and"> | </span>
							<span>{this.state.UniswapBLXM} {this.state.ethBasicName}</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}