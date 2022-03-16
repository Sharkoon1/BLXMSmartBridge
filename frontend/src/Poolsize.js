import React, { Component } from "react";
import { ethers } from "ethers";
import UrlHandler from "./UrlHandler";
const url = UrlHandler();
import "./style/Poolsize.css";
import { get } from "./RequestHandler";

export default class Poolsize extends Component {

	constructor(props) {
		super(props)
		this.visitPageBsc = this.visitPageBsc.bind(this);
		this.visitPageEth = this.visitPageEth.bind(this);
		this.state = {
			PancakeswapBNB: "Loading",
			PancakeswapBLXM: "Loading",
			UniswapETH: "Loading",
			UniswapBLXM: "Loading",
			bscStableName: "",
			bscBasicName: "",
			ethStableName: "",
			ethBasicName: "",
			poolAddressEth: "0x0000000000000000000000000000000000000000",
			poolAddressBsc: "0x0000000000000000000000000000000000000000"
		}
	}
	componentDidMount() {
		get(url + "api/oracle/poolData").then(result => {
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
				urlBsc = 'https://testnet.bscscan.com/address/' + this.state.poolAddressBsc;
			}
			else if(network === "Mainnet"){
				urlBsc = 'https://bscscan.com/address/' + this.state.poolAddressBsc;
				}

				window.open(urlBsc, "_blank")
			})
		}
    

	visitPageEth(){
		this.getChainId().then((network) => {

			let urlEth;

			if(network === "Testnet"){
				urlEth = 'https://rinkeby.etherscan.io/address/' + this.state.poolAddressEth;
			}
			else if(network === "Mainnet"){
				urlEth = 'https://etherscan.io/address/' + this.state.poolAddressEth;
				}

				window.open(urlEth, "_blank")
			})
		}


	render() {
		return (
			<div className="displayPoolsizes">
				<span className="tooltipdashboard">
					<h1 className='headingPoolsize'>Liquidity Pool Overview
						<span class="tooltiptext">Information about the LPs</span>
					</h1> 
				</span>
				<div className="displayPoolsizeBSC">
					<div className="contentPoolsize">
					<h1 className="textPoolsize">
						<span className="poolsizeSubHeading">Pancakeswap Pool </span>
						<span className="displayPoolAddress">{this.state.poolAddressBsc}</span>
						<span><button onClick={this.visitPageBsc} type="button" title="Link to testnet.bscscan.com" className="poolsizeButton"><img className="poolsizeButtonPicture" src="../copy2.png"></img></button>
						</span>
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
							<span><button onClick={this.visitPageEth} type="button" title="Link to rinkeby.etherscan.io" className="poolsizeButton"><img className="poolsizeButtonPicture" src="../copy2.png"></img></button>
							</span></h1>
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