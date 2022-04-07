import React, { Component } from "react";
import UrlHandler from "./UrlHandler";
import { get } from "./RequestHandler";
import { ethers } from "ethers";
const url = UrlHandler();


export default class WalletOverview extends Component {

	constructor(props) {
		super(props)
		this.visitPageBsc = this.visitPageBsc.bind(this);
		this.visitPageEth = this.visitPageEth.bind(this);
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
			NameETHBasic: "Loading...",
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
			ETHArbitrageContractAddress: "0x0000000000000000000000000000000000000000",
			BSCWalletAddress: "0x0000000000000000000000000000000000000000",
			ETHWalletAddress: "0x0000000000000000000000000000000000000000",
		}
	}

	componentDidMount() {
		get(url + "api/oracle/liquidity ").then(result => {
			if (result.status === 1) {
				this.setState(prevState => {
					return {
						BSCWalletAddress: result.data.BSCWalletAddress,
						ETHWalletAddress: result.data.ETHWalletAddress,
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
			} 
		});
	}

	async getChainId() {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const networkId = await provider.getNetwork()
		if (networkId.chainId === 4 || networkId.chainId === 97) {
			return "Testnet";
		} else if (networkId.chainId === 1 || networkId.chainId === 56) {
			return "Mainnet";
		}
	}

	visitPageBsc(adress) {
		this.getChainId().then((network) => {

			let urlBsc;

			if (network === "Testnet") {
				urlBsc = 'https://testnet.bscscan.com/address/' + adress;
			}
			else if (network === "Mainnet") {
				urlBsc = 'https://bscscan.com/address/' + adress;
			}
			console.log(urlBsc)
			window.open(urlBsc, "_blank")
		})
	}


	visitPageEth(adress) {
		this.getChainId().then((network) => {

			let urlEth;

			if (network === "Testnet") {
				urlEth = 'https://rinkeby.etherscan.io/address/' + adress;
			}
			else if (network === "Mainnet") {
				urlEth = 'https://etherscan.io/address/' + adress;
			}

			window.open(urlEth, "_blank")
		})
	}


	render() {
		return (
				

			<div className="displayPoolsizes">
			{/*  Display information about the Abitrage Wallet - pays fees  */}
				<span className="tooltipdashboard">
					<h1 className='headingPoolsize'>Abitrage Wallet Overview
						<span class="tooltiptext">Pays the transaction fees</span>
					</h1> 
				</span>

				{/*  Abitrage Wallet BSC (left)  */}
				<div className="abitrageWalletBsc">
					<div className="contentPoolsize">
						<h1> 
							<span className="poolsizeSubHeading">Abitrage Wallet BSC </span>
							<span className="displayPoolAddress">{this.state.BSCWalletAddress}</span>
							<span>
								<button onClick={()=>{this.visitPageBsc(this.state.BSCWalletAddress)}} type="button" title="Link to testnet.bscscan.com" className="poolsizeButton"><img className="poolsizeButtonPicture" src="../copy2.png"></img></button>
							</span>
						
						</h1>
						<div>
							<span>{this.state.AbitrageBNB} BNB</span>
						</div>

					</div>
					
				</div>

				{/*  Abitrage Wallet ETH (right) */}
				<div className="abitrageWalletEth">
					<div className="contentPoolsize">
					<h1>
						<span className="poolsizeSubHeading">Abitrage Wallet ETH </span>
							<span className="displayPoolAddress">{this.state.ETHWalletAddress}</span>
							<span>
								<button onClick={()=>{this.visitPageEth(this.state.ETHWalletAddress)}} type="button" title="Link to testnet.bscscan.com" className="poolsizeButton"><img className="poolsizeButtonPicture" src="../copy2.png"></img></button>
							</span>
					</h1>
						<div>
							<span>{this.state.AbitrageETH} ETH </span>
						</div>

					</div>
					
				</div>

				{/* Display Information about the abitrage smart contract */}
		
				<h1 className='headingPoolsize'>Abitrage Contract Liquidity Overview</h1> 
			
			
				<div className="displayPoolsizeBSC">
					<div className="contentPoolsize">
						<h1>
							<span className="poolsizeSubHeading">BSC Arbitrage Contract </span>
							<span className="displayPoolAddress">{this.state.BSCArbitrageContractAddress}</span>
							<span>
								<button onClick={()=>{this.visitPageBsc(this.state.BSCArbitrageContractAddress)}} type="button" title="Link to testnet.bscscan.com" className="poolsizeButton"><img className="poolsizeButtonPicture" src="../copy2.png"></img></button>
							</span>
						</h1>
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
							<span>
								<button onClick={()=>{this.visitPageEth(this.state.ETHArbitrageContractAddress)}} type="button" title="Link to testnet.bscscan.com" className="poolsizeButton"><img className="poolsizeButtonPicture" src="../copy2.png"></img></button>
							</span>
						</h1>
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