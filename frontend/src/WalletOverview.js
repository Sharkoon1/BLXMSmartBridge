import React, { Component } from "react";
import UrlHandler from "./UrlHandler";
import axios from 'axios';
const url = UrlHandler();

//Todo
//get data
//insert to frontend

export default class WalletOverview extends Component {

	constructor(props) {
		super(props)
		this.state = {
			AbitrageETH: 0,
			AbitrageBNB: 0,
			BinanceBNB: 0,
			BinanceBLXM: 0,
			EthereumETH: 0,
			EthereumBLXM: 0
		}
	}
	/*
	componentDidMount() {
		axios.get(url + "api/oracle/liquidity ").then((res) => {
			let uni = res.data.data.UniBLXMPrice;
			let pancake = res.data.data.PancakeBLXMPrice;
			this.setState(prevState => {
				return {
					data: [...prevState.data, ...distinctTimeStampData]
				};
			});
		});
	}*/
	
	render() {
		return (
			<div className="displayPoolsizes">
				<h1 className='headingPoolsize'>Abitrage Liquidity Overview</h1>
				<div className="abitrageWallet">
					<div className="contentPoolsize">
						<h1 className="poolsizeSubHeading">Abitrage Wallet</h1>
						<div>
							<span>{this.state.AbitrageETH} ETH </span>
							<span className="and"> | </span>
							<span>{this.state.AbitrageBNB} BNB</span>
						</div>
					</div>
				</div>

				<div className="displayPoolsizeBSC">
					<div className="contentPoolsize">
						<h1 className="poolsizeSubHeading">Binance Smart Chain</h1>
						<div>
							<span>{this.state.BinanceBNB} BNB </span>
							<span className="and"> | </span>
							<span>{this.state.BinanceBLXM} BXLM</span>
						</div>
					</div>

				</div>

				<div className="displayPoolsizeETH">
					<div className="contentPoolsize">
						<h1 className="poolsizeSubHeading">Ethereum</h1>
						<div>
							<span>{this.state.EthereumETH} WETH</span>
							<span className="and"> | </span>
							<span>{this.state.EthereumBLXM} BXLM </span>
						</div>
					</div>
				</div>
			</div>
		);
	}

}