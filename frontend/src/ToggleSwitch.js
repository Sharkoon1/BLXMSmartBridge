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
		console.log("input field bsc")
		console.log(e.target.value)
		if (re.test(e.target.value)) {
<<<<<<< HEAD
=======
			if (e.target.value !== "e") {
>>>>>>> 1c6933f327854ff76e66f06224c3bffad6ccf7de
			this.setState(prevState => {
				return {
					maxSwapAmountStable: e.target.value,
					maxSwapAmountBasic: prevState.maxSwapAmountBasic,
					checked: prevState.checked
				};
			});
			} else {
				e.target.value = ""
			}
		} else {
			e.target.value = ""
		}
	}

<<<<<<< HEAD
	onChangeBasic(e) {
		const re = /^\d*(\.\d+)?$/;
		if (re.test(e.target.value)) {
=======
	keydown(event) {
		return event.keyCode === 8 || event.keyCode === 46 ? true : !isNaN(Number(event.key));
	}



	onChangeEth(e) {
		debugger
		const re = /^\d*(\.\d+)?$/;
		if (re.test(e.target.value)) {
			console.log("input field eth")
			console.log(e.target.value)
			if (e.target.value !== "e") {
>>>>>>> 1c6933f327854ff76e66f06224c3bffad6ccf7de
			this.setState(prevState => {
				return {
					maxSwapAmountBasic: e.target.value,
					maxSwapAmountStable: prevState.maxSwapAmountStable,
					checked: prevState.checked
				};
			});
			}
		} else {
			e.target.value = ""
		}
	}

	apply() {
		let maxSwapAmountBasic = parseFloat(this.state.maxSwapAmountBasic);
		let maxSwapAmountStable = parseFloat(this.state.maxSwapAmountStable);

		if(maxSwapAmountBasic < 0 ||  maxSwapAmountStable < 0) {
			this.props.setError("Max basic or stable swap amount can not be a negative value.");

			setTimeout(() => { this.props.setError(null); }, 3000);
		}

		else {
			post(url + "api/maxSwapAmount/values", { maxSwapAmountBasic: maxSwapAmountBasic, maxSwapAmountStable: maxSwapAmountStable }).then(response => {
				if (response.status === 1) {
					this.props.setAlert("Successfully set max swap amount!");
	
					setTimeout(() => { this.props.setAlert(null); }, 3000);
				} else {
					this.props.setError("An error occured. Response code: " + response.status);
	
					setTimeout(() => { this.props.setError(null); }, 3000);
				}
			});
		}
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
<<<<<<< HEAD
								<label>Max swap amount Basic</label>
								<input className="changeSwapAmountText" type="number" type="number" onChange={this.onChangeBasic} value={this.state.maxSwapAmountBasic}/>

								<label>Max swap amount Stable</label>
								<input className="changeSwapAmountText" type="number" onChange={this.onChangeStable} value={this.state.maxSwapAmountStable}/>
=======
								<label>Max swap amount ETH network</label>
								<input className="changeSwapAmountText" type="number" onChange={this.onChangeEth} onKeyDown={this.keydown} value={this.state.ethMaxSwapAmount}/>

								<label>Max swap amount BSC network</label>
								<input className="changeSwapAmountText" type="number" onChange={this.onChangeBsc} onKeyDown={this.keydown} value={this.state.bscMaxSwapAmount}/>
>>>>>>> 1c6933f327854ff76e66f06224c3bffad6ccf7de
							</div>
							<button className='modalButton' onClick={this.apply}>Apply</button>
						</Fragment>
						: null
				}
			</div>
		);
	}
}