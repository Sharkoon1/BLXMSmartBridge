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
	
	componentDidMount() {
		axios.get(url + "api/oracle/liquidity ").then((res) => {
			this.setState(prevState => {
				return {
					AbitrageETH: res.data.data.ETHBalance,
					AbitrageBNB: res.data.data.BSCBalance,
					BinanceBNB: res.data.data.BSCStable,
					BinanceBLXM: res.data.data.BSCBasic,
					EthereumETH: res.data.data.ETHStable,
					EthereumBLXM: res.data.data.ETHBasic
				};
			});
		});
	}
	
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
							<span>{this.state.AbitrageBNB} Basic</span>
						</div>
					</div>
				</div>

				<div className="displayPoolsizeBSC">
					<div className="contentPoolsize">
						<h1 className="poolsizeSubHeading">Binance Smart Chain</h1>
						<div>
							<span>{this.state.BinanceBNB} Stable</span>
							<span className="and"> | </span>
							<span>{this.state.BinanceBLXM} Basic</span>
						</div>
					</div>

				</div>

				<div className="displayPoolsizeETH">
					<div className="contentPoolsize">
						<h1 className="poolsizeSubHeading">Ethereum</h1>
						<div>
							<span>{this.state.EthereumETH} Stable</span>
							<span className="and"> | </span>
							<span>{this.state.EthereumBLXM} Basic</span>
						</div>
					</div>
				</div>
			</div>
		);
	}

}