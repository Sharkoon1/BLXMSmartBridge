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
			AbitrageETH: "Loading...",
			AbitrageBNB: "Loading...",
			BinanceBNB: "Loading...",
			BinanceBLXM: "Loading...",
			EthereumETH: "Loading...",
			EthereumBLXM: "Loading...",
			NameBSCStable: "Loading...",
			NameBSCBasic: "Loading...",
			NameETHStable: "Loading...",
			NameETHBasic: "Loading..."
		}
	}
	
	componentDidMount() {
		axios.get(url + "api/oracle/liquidity ").then((res) => {
			console.log(res);
			this.setState(prevState => {
				return {
					AbitrageETH: res.data.data.ETHBalance,
					AbitrageBNB: res.data.data.BSCBalance,
					BinanceBNB: res.data.data.BSCStable,
					BinanceBLXM: res.data.data.BSCBasic,
					EthereumETH: res.data.data.ETHStable,
					EthereumBLXM: res.data.data.ETHBasic,
					NameBSCStable: res.data.data.NameBSCStable,
					NameBSCBasic: res.data.data.NameBSCBasic,
					NameETHStable: res.data.data.NameETHStable,
					NameETHBasic: res.data.data.NameETHBasic
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
							<span>{this.state.AbitrageBNB} BNB</span>
						</div>
					</div>
				</div>

				<div className="displayPoolsizeBSC">
					<div className="contentPoolsize">
						<h1 className="poolsizeSubHeading">Binance Smart Chain</h1>
						<div>
							<span>{this.state.BinanceBNB} {this.state.NameBSCStable}</span>
							<span className="and"> | </span>
							<span>{this.state.BinanceBLXM} {this.state.NameBSCBasic}</span>
						</div>
					</div>

				</div>

				<div className="displayPoolsizeETH">
					<div className="contentPoolsize">
						<h1 className="poolsizeSubHeading">Ethereum</h1>
						<div>
							<span>{this.state.EthereumETH} {this.state.NameETHStable}</span>
							<span className="and"> | </span>
							<span>{this.state.EthereumBLXM} {this.state.NameETHBasic}</span>
						</div>
					</div>
				</div>
			</div>
		);
	}

}