import React, { Component } from "react";
import Switch from "react-switch";
import "./style/SettingsModal.css"

export default class ToggleSwitch extends Component {
  constructor() {
    super();
    this.state = { checked: true };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked });
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
            
            <div className="setMaxSwapAmountNetwork">
                <div>
                    <span className='modalSubHeading SwapAmount'>Max swap amount ETH network</span>
                    <input className='modalInput' type="number" ></input>
                </div> 

                <div>
                    <span className='modalSubHeading SwapAmount'>Max swap amount BSC network</span>
                    <input className='modalInput' type="number"></input>
                </div> 
                <button className='modalButton'>Apply</button>
            </div>
        </div>
    );
  }
}