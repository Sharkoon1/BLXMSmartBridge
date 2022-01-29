import React, { Component } from "react";
import UrlHandler from "./UrlHandler";
import axios from 'axios';
const url = UrlHandler();
import "./style/Poolsize.css";

export default class Poolsize extends Component {

	constructor(props) {
		super(props)
		this.state = {
			PancakeswapBNB: 0,
			PancakeswapBLXM: 0,
			UniswapETH: 0,
			UniswapBLXM: 0
		}
	}
	componentDidMount() {
		axios.get(url + "api/oracle/poolsize ").then((res) => {
			this.setState(prevState => {
				debugger;
				return {
					PancakeswapBNB: res.data.data.PancakeswapStable,
					PancakeswapBLXM: res.data.data.PancakeswapBLXM,
					UniswapETH: res.data.data.UniswapStables,
					UniswapBLXM: res.data.data.UniswapBLXM
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
							<span>{this.state.PancakeswapBNB} BNB</span>
							<span className="and"> | </span>
							<span>{this.state.PancakeswapBLXM} BXLM</span>
						</div>
					</div>

				</div>

				<div className="displayPoolsizeETH">
					<div className="contentPoolsize">
						<h1 className="poolsizeSubHeading">Uniswap Pool</h1>
						<div>
							<span>{this.state.UniswapETH} WETH</span>
							<span className="and"> | </span>
							<span>{this.state.UniswapBLXM} BXLM</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}