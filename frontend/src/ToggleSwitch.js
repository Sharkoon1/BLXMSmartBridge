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
		this.state = { checked: false, maxSwapAmountBasic: 0, maxSwapAmountStable: 0 };
		this.handleChange = this.handleChange.bind(this);
		this.onChangeStable = this.onChangeStable.bind(this);
		this.onChangeBasic = this.onChangeBasic.bind(this);
		this.apply = this.apply.bind(this);
	}

	componentDidMount(){
		get(url + "api/maxSwapAmount/").then(response => {
			this.setState({checked: response.data.checked, maxSwapAmountStable: response.data.maxSwapAmountStable, maxSwapAmountBasic: response.data.maxSwapAmountBasic});
		})
	}

	handleChange(checked) {
		post(url + "api/maxSwapAmount/", { checked: checked }).then(response => {
			if (response.status === 1) {
				get(url + "api/maxSwapAmount/").then(response => {
					this.setState({checked: response.data.checked, maxSwapAmountStable: response.data.maxSwapAmountStable, maxSwapAmountBasic: response.data.maxSwapAmountBasic});
				})
				/*
				this.setState(prevState => {
					return {
						maxSwapAmountStable: prevState.maxSwapAmountStable,
						maxSwapAmountBasic: prevState.maxSwapAmountBasic,
						checked: checked
					};
				});*/
			} else {
				// Failure
			}
		});
	}

	onChangeStable(e) {
		const re = /^\d*(\.\d+)?$/;
		if (re.test(e.target.value)) {
			this.setState(prevState => {
				return {
					maxSwapAmountStable: e.target.value,
					maxSwapAmountBasic: prevState.maxSwapAmountBasic,
					checked: prevState.checked
				};
			});
		}
	}

	onChangeBasic(e) {
		const re = /^\d*(\.\d+)?$/;
		if (re.test(e.target.value)) {
			this.setState(prevState => {
				return {
					maxSwapAmountBasic: e.target.value,
					maxSwapAmountStable: prevState.maxSwapAmountStable,
					checked: prevState.checked
				};
			});
		}
	}

	apply() {
		post(url + "api/maxSwapAmount/values", { maxSwapAmountBasic: parseFloat(this.state.maxSwapAmountBasic), maxSwapAmountStable: parseFloat(this.state.maxSwapAmountStable) }).then(response => {
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
								<label>Max swap amount Basic</label>
								<input className="changeSwapAmountText" type="number" type="number" onChange={this.onChangeBasic} value={this.state.maxSwapAmountBasic}/>

								<label>Max swap amount Stable</label>
								<input className="changeSwapAmountText" type="number" onChange={this.onChangeStable} value={this.state.maxSwapAmountStable}/>
							</div>
							<button className='modalButton' onClick={this.apply}>Apply</button>
						</Fragment>
						: null
				}
			</div>
		);
	}
}