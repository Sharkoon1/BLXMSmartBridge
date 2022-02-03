import React, { Component } from "react";
import UrlHandler from "./UrlHandler";
import { ethers } from "ethers";
const url = UrlHandler();

//Todo
//get data
//insert to frontend

export default class WalletOverview extends Component {

	constructor(props) {
		super(props)
		this.visitPageBsc = this.visitPageBsc.bind(this);
		this.visitPageEth = this.visitPageEth.bind(this);
		this.state = {
			AbitrageETH: "Loading ",
			AbitrageBNB: "Loading ",
			BinanceBNB: "Loading",
			BinanceBLXM: "Loading",
			EthereumETH: "Loading",
			EthereumBLXM: "Loading",
			NameBSCStable: "",
			NameBSCBasic: "",
			NameETHStable: "",
			NameETHBasic: "",
			BSCArbitrageContractAddress: "0x0000000000000000000000000000000000000000",
			ETHArbitrageContractAddress: "0x0000000000000000000000000000000000000000"
		}
	}
	
	componentDidMount() {
		fetch(url + "api/oracle/liquidity ").then(res => res.json())
											.then(result => {
			this.setState(prevState => {
				return {
					AbitrageETH: result.data.ETHBalance,
					AbitrageBNB: result.data.BSCBalance,
					BinanceBNB: result.data.BSCStable,
					BinanceBLXM: result.data.BSCBasic,
					EthereumETH: result.data.ETHStable,
					EthereumBLXM: result.data.ETHBasic,
					NameBSCStable: result.data.NameBSCStable,
					NameBSCBasic: result.data.NameBSCBasic,
					NameETHStable: result.data.NameETHStable,
					NameETHBasic: result.data.NameETHBasic,
					BSCArbitrageContractAddress: result.data.BSCArbitrageContractAddress,
					ETHArbitrageContractAddress: result.data.ETHArbitrageContractAddress
				};
			});
		});
	}

	async getChainId(){
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const networkId = await provider.getNetwork()
		if (networkId.chainId === 4 || networkId.chainId === 97){
			return "Testnet";
		} else if (networkId.chainId === 1 || networkId.chainId === 96) {
			return "Mainnet";
		}
	}

	visitPageBsc() {
		this.getChainId().then((network) => {

			let urlBsc;

			if(network === "Testnet"){
				urlBsc = 'https://testnet.bscscan.com/address/' + this.state.BSCArbitrageContractAddress;
			}
			else if(network === "Mainnet"){
				urlBsc = 'https://bscscan.com/address/' + this.state.BSCArbitrageContractAddress;
				}
				console.log(urlBsc)
				window.open(urlBsc, "_blank")
			})
		}
    

	visitPageEth(){
		this.getChainId().then((network) => {

			let urlEth;

			if(network === "Testnet"){
				urlEth = 'https://rinkeby.etherscan.io/address/' + this.state.ETHArbitrageContractAddress;
			}
			else if(network === "Mainnet"){
				urlEth = 'https://etherscan.io/address/' + this.state.ETHArbitrageContractAddress;
				}

				window.open(urlEth, "_blank")
			})
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
						<h1>
						<span className="poolsizeSubHeading">BSC Arbitrage Contract </span>
						<span className="displayPoolAddress">{this.state.BSCArbitrageContractAddress}</span>
						<span><button onClick={this.visitPageBsc} type="button" title="Link to testnet.bscscan.com" className="poolsizeButton"><img className="poolsizeButtonPicture" src="../copy2.png"></img></button>
						</span></h1>
						<div>
							<span>{this.state.BinanceBNB} {this.state.NameBSCStable}</span>
							<span className="and"> | </span>
							<span>{this.state.BinanceBLXM} {this.state.NameBSCBasic}</span>
						</div>
					</div>

				</div>

				<div className="displayPoolsizeETH">
					<div className="contentPoolsize">
					<h1>
						<span className="poolsizeSubHeading">ETH Arbitrage Contract </span>
						<span className="displayPoolAddress">{this.state.ETHArbitrageContractAddress}</span>
						<span><button onClick={this.visitPageEth} type="button" title="Link to testnet.bscscan.com" className="poolsizeButton"><img className="poolsizeButtonPicture" src="../copy2.png"></img></button>
						</span></h1>
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