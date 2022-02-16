import React, { Component } from "react";
import Switch from "react-switch";
import { post } from "./RequestHandler";
import UrlHandler from "./UrlHandler";
import AlertInfo from "./AlertInfo";
import ErrorMessage from './ErrorMessage';
import "./style/SettingsModal.css"
const url = UrlHandler();

export default class ToggleSwitch extends Component {
	constructor() {
		super();
		this.state = { checked: true, ETHMax: 0, BSCMax: 0 };
		this.handleChange = this.handleChange.bind(this);
		this.onChangeBsc = this.onChangeBsc.bind(this);
		this.onChangeEth = this.onChangeEth.bind(this);
		this.apply = this.apply.bind(this);
	}

	handleChange(checked) {
		post(url + "api/maxSwapAmount/", { checked: this.state = checked.toString() }).then(response => {
			if (response.status === 1) {
				this.setState(prevState => {
					return {
						BSCMax: prevState.BSCMax,
						ETHMax: prevState.ETHMax,
						checked: checked
					};
				});
			} else {
				// Failure
			}
		});
	}

	onChangeBsc(e) {
		// regex to only allow 1 to 100 percent slippage.
		const re = /^\d+$/;
		if (re.test(e.target.value)) {
			console.log(e.target.value)
			this.setState(prevState => {
				return {
					BSCMax: e.target.value,
					ETHMax: prevState.ETHMax,
					checked: prevState.checked
				};
			});
		}
	}

	onChangeEth(e) {
		// regex to only allow 1 to 100 percent slippage.
		const re = /^\d+$/;
		if (re.test(e.target.value)) {
			console.log(e.target.value)
			this.setState(prevState => {
				return {
					ETHMax: e.target.value,
					BSCMax: prevState.BSCMax,
					checked: prevState.checked
				};
			});
		}
	}

	apply() {
		post(url + "api/maxSwapAmount/values", { ETHMax: parseInt(this.state.ETHMax), BSCMax: parseInt(this.state.BSCMax) }).then(response => {
			if (response.status === 1) {
				//setAlert("Success!");
			} else {
				//setError("An error occured. Response code: " + response.status)
			}
		});
	}

	render() {
		return (
			<div className="toggleSwitchContent">
				<div>
					<div className="toggleSwitchSwitch">
						<Switch onChange={this.handleChange} checked={this.state.checked} />
					</div>
					<h1 className="toggleSwitchSwitchText">Use full abitrage contract balance for maximum swap amount</h1>
				</div>
				{
					this.state.checked ?
						<div className="setMaxSwapAmountNetwork">
							<div>
								<span className='modalSubHeading SwapAmount'>Max swap amount ETH network</span>
								<input className='modalInput' type="number" onChange={this.onChangeEth} value={this.state.ETHMax} ></input>
							</div>

							<div>
								<span className='modalSubHeading SwapAmount'>Max swap amount BSC network</span>
								<input className='modalInput' type="number" onChange={this.onChangeBsc} value={this.state.BSCMax}></input>
							</div>
							<button className='modalButton' onClick={this.apply}>Apply</button>
						</div>
						: null
				}
			</div>
		);
	}
}