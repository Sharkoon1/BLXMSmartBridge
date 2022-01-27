import React, { Component, Fragment, useState } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from "recharts";
import UrlHandler from "./UrlHandler";
import axios from 'axios';
import "./style/DashboardGraph.css";


const url = UrlHandler();
const queryIntervalSeconds = 10;

//
/*
	{ timestamp: "16.01.2022, 16:05", Pancakeswap: 2.5, Uniswap: 2.3, },
	{ timestamp: "16.01.2022, 16:06", Pancakeswap: 2.6, Uniswap: 2.4, },
	{ timestamp: "16.01.2022, 16:07", Pancakeswap: 2.7, Uniswap: 2.5, },
	{ timestamp: "16.01.2022, 16:08", Pancakeswap: 2.5, Uniswap: 2.4, },
	{ timestamp: "16.01.2022, 16:09", Pancakeswap: 2.4, Uniswap: 2.3, },
	{ timestamp: "16.01.2022, 16:10", Pancakeswap: 2.3, Uniswap: 2.2, },
	{ timestamp: "16.01.2022, 16:11", Pancakeswap: 2.5, Uniswap: 2.1, },
	{ timestamp: "16.01.2022, 16:12", Pancakeswap: 2.7, Uniswap: 2.7, },
	{ timestamp: "16.01.2022, 16:13", Pancakeswap: 2.6, Uniswap: 2.7, },
	{ timestamp: "16.01.2022, 16:14", Pancakeswap: 2.1, Uniswap: 2.4, },

*/

async function getData() {
	//console.log("function called!");
	axios.get(url + "api/oracle/price").then((res) => {
		//console.log(res.data);
		//data.push()
		setData([data, { timestamp: res.data.data.UniBLXMPrice.Timestamp, Pancakeswap: res.data.data.PancakeBLXMPrice.Price, Uniswap: res.data.data.UniBLXMPrice.Price }]);
		console.log(data)
		console.log(res.data.data.UniBLXMPrice.Price);
		console.log(res.data.data.UniBLXMPrice.Timestamp);
		console.log(res.data.data.PancakeBLXMPrice.Price);
		console.log(res.data.data.PancakeBLXMPrice.Timestamp);
	});
}

class DashboardGraph extends Component {

	constructor(props) {
		super(props)
		this.state = {
			data: []
		}
	}

	componentDidMount() {
		axios.get(url + "api/oracle/price").then((res) => {
			let uni = res.data.data.UniBLXMPrice;
			let pancake = res.data.data.PancakeBLXMPrice;

			let dataArray = [];

			Object.keys(uni).forEach((key) => {
				var existsPancake = pancake.find(({pancakeTimeStamp}) => uni[key].timestamp === pancakeTimeStamp);
				
				dataArray.push({timestamp: existsPancake.Timestamp, Pancakeswap: uni[key].Price, Uniswap: existsPancake.Price });
			})

			console.log(this.state.data);
			console.log(res.data.data.UniBLXMPrice.Price);
			console.log(res.data.data.UniBLXMPrice.Timestamp);
			console.log(res.data.data.PancakeBLXMPrice.Price);
			console.log(res.data.data.PancakeBLXMPrice.Timestamp);
			this.setState(prevState => {
				return {
					data: [...prevState.data, ...dataArray]
				};
			});
		});
	}


	// Make a request for a user with a given ID

	render() {
		return (
			<Fragment>
				<h1 className='headingDashboardGraph'>Smartbridge Overview</h1>
				<div className='dashboardGraph'>
					<LineChart className='lineChart' data={this.state.data} width={1000} height={300}
						margin={{ top: 50, right: 30, left: 20, bottom: 20 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="timestamp" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="Uniswap" stroke="#49956a" activeDot={{ r: 8 }} />
						<Line type="monotone" dataKey="Pancakeswap" stroke="#203a4b" />
					</LineChart>
				</div>
			</Fragment>
		);
	}
}

export default DashboardGraph;