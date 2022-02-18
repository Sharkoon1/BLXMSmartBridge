import React, { Component, Fragment } from "react";
import Switch from "react-switch";
import { post, get } from "./RequestHandler";
import UrlHandler from "./UrlHandler";
import AlertInfo from "./AlertInfo";
import ErrorMessage from './ErrorMessage';
import "./style/SettingsModal.css"
const url = UrlHandler();

export default class ToggleSwitch extends Component {
	constructor(props) {
		super(props);
		this.state = { checked: false, ethMaxSwapAmount: 0, bscMaxSwapAmount: 0 };
		this.handleChange = this.handleChange.bind(this);
		this.onChangeBsc = this.onChangeBsc.bind(this);
		this.onChangeEth = this.onChangeEth.bind(this);
		this.apply = this.apply.bind(this);
	}

	componentDidMount(){
		get(url + "api/maxSwapAmount/").then(response => {
			this.setState({checked: response.data.checked, bscMaxSwapAmount: response.data.bscMaxSwapAmount, ethMaxSwapAmount: response.data.ethMaxSwapAmount});
		})
	}

	handleChange(checked) {
		post(url + "api/maxSwapAmount/", { checked: checked }).then(response => {
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
		post(url + "api/maxSwapAmount/values", { ethMaxSwapAmount: parseFloat(this.state.ethMaxSwapAmount), bscMaxSwapAmount: parseFloat(this.state.bscMaxSwapAmount) }).then(response => {
			if (response.status === 1) {
				this.props.setAlert("Successfully set max swap amount!");
			} else {
				this.props.setError("An error occured. Response code: " + response.status);
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
						<Fragment>
							<div class="settingsSwapAmount">
								<label>Max swap amount ETH network</label>
								<input className="changeSwapAmountText" placeholder="BLXM" type="number" type="number" onChange={this.onChangeEth} value={this.state.ethMaxSwapAmount}/>

								<label>Max swap amount BSC network</label>
								<input className="changeSwapAmountText" placeholder="BLXM" type="number" onChange={this.onChangeBsc} value={this.state.bscMaxSwapAmount}/>
							</div>
							<button className='modalButton' onClick={this.apply}>Apply</button>
						</Fragment>
						: null
				}
			</div>
		);
	}
}