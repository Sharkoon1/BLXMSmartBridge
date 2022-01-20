import React, { Component, Fragment } from 'react';
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

import "./style/DashboardGraph.css"

const data = [
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
];
//


class DashboardGraph extends Component {
    render() {
        return (
            <Fragment>
            <h1 className='headingDashboardGraph'>Smartbridge Overview</h1>
            <div className='dashboardGraph'>
                    <LineChart className='lineChart' data={data} width={1000} height={300}
                        margin={{ top: 50, right: 30, left: 20, bottom: 20}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip/>
                        <Legend />
                        <Line type="monotone" dataKey="Uniswap" stroke="#49956a" activeDot={{ r: 8 }}/>
                        <Line type="monotone" dataKey="Pancakeswap" stroke="#203a4b" />
                    </LineChart>
            </div>
            </Fragment>
        );
    }
}

export default DashboardGraph;