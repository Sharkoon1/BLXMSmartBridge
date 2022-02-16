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
		this.state = { checked: false, ethMaxSwapAmount: 0, bscMaxSwapAmount: 0 };
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
						bscMaxSwapAmount: prevState.bscMaxSwapAmount,
						ethMaxSwapAmount: prevState.ethMaxSwapAmount,
						checked: checked
					};
				});
			} else {
				// Failure
			}
		});
	}

	onChangeBsc(e) {
		const re = /^\d*(\.\d+)?$/;
		if (re.test(e.target.value)) {
			console.log(e.target.value)
			this.setState(prevState => {
				return {
					bscMaxSwapAmount: e.target.value,
					ethMaxSwapAmount: prevState.ethMaxSwapAmount,
					checked: prevState.checked
				};
			});
		}
	}

	onChangeEth(e) {
		const re = /^\d*(\.\d+)?$/;
		if (re.test(e.target.value)) {
			console.log(e.target.value)
			this.setState(prevState => {
				return {
					ethMaxSwapAmount: e.target.value,
					bscMaxSwapAmount: prevState.bscMaxSwapAmount,
					checked: prevState.checked
				};
			});
		}
	}

	apply() {
		post(url + "api/maxSwapAmount/values", { ethMaxSwapAmount: parseInt(this.state.ethMaxSwapAmount), bscMaxSwapAmount: parseInt(this.state.bscMaxSwapAmount) }).then(response => {
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
					<h1 className="toggleSwitchSwitchText">Use custom swap amount</h1>
				</div>
				{
					this.state.checked ?
						<div className="setMaxSwapAmountNetwork">
							<div>
								<span className='modalSubHeading SwapAmount'>Max swap amount ETH network</span>
								<input className='modalInput' type="number" onChange={this.onChangeEth} value={this.state.ethMaxSwapAmount} ></input>
							</div>

							<div>
								<span className='modalSubHeading SwapAmount'>Max swap amount BSC network</span>
								<input className='modalInput' type="number" onChange={this.onChangeBsc} value={this.state.bscMaxSwapAmount}></input>
							</div>
							<button className='modalButton' onClick={this.apply}>Apply</button>
						</div>
						: null
				}
			</div>
		);
	}
}