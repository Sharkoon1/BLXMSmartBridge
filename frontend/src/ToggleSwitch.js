import React, { Component, Fragment } from "react";
import Switch from "react-switch";
import { post, get } from "./RequestHandler";
import UrlHandler from "./UrlHandler";
import AlertInfo from "./AlertInfo";
import ErrorMessage from './ErrorMessage';
import "./style/SettingsModal.css"
import { blockInvalidChar } from "./utils/BlockInvalidChar"; 
const url = UrlHandler();

export default class ToggleSwitch extends Component {
	constructor(props) {
		super(props);
		this.state = { checked: false, maxSwapAmountBasic: 0, maxSwapAmountStable: 0 };
		this.handleChange = this.handleChange.bind(this);
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
								<label>Max swap amount Basic</label>
								<input className="changeSwapAmountText" type="number" pattern="[0-9]+([,.][0-9]+)?" onKeyDown={blockInvalidChar} onChange={e => this.setState({maxSwapAmountBasic: e.value})} value={this.state.maxSwapAmountBasic}/>

								<label>Max swap amount Stable</label>
								<input className="changeSwapAmountText" type="number" pattern="[0-9]+([,.][0-9]+)?" onKeyDown={blockInvalidChar} onChange={e => this.setState({maxSwapAmountStable: e.value})} value={this.state.maxSwapAmountStable}/>
							</div>
							<button className='modalButton' onClick={this.apply}>Apply</button>
						</Fragment>
						: null
				}
			</div>
		);
	}
}