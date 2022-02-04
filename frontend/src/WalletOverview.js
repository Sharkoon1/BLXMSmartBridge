import React, { Component } from "react";
import UrlHandler from "./UrlHandler";
import { get } from "./RequestHandler";
const url = UrlHandler();


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
		get(url + "api/oracle/liquidity ").then(result => {
			console.log(result);
			this.setState(prevState => {
				return {
					AbitrageETH: result.data.ETHBalance,
					AbitrageBNB: result.data.BSCBalance,
					BinanceBNB: result.data.BSCStable,
					BinanceBLXM: result.data.BSCBasic,
					EthereumETH: result.data.ETHStable,
					EthereumBLXM: result.data.ETHBasic,
					//Pooladres
					NameBSCStable: result.data.NameBSCStable,
					NameBSCBasic: result.data.NameBSCBasic,
					NameETHStable: result.data.NameETHStable,
					NameETHBasic: result.data.NameETHBasic
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
						<h1 className="poolsizeSubHeading">BSC Arbitrage Contract</h1>
						<div>
							<span>{this.state.BinanceBNB} {this.state.NameBSCStable}</span>
							<span className="and"> | </span>
							<span>{this.state.BinanceBLXM} {this.state.NameBSCBasic}</span>
						</div>
					</div>

				</div>

				<div className="displayPoolsizeETH">
					<div className="contentPoolsize">
						<h1 className="poolsizeSubHeading">ETH Arbitrage Contract</h1>
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