import React, { Component, Fragment } from 'react';
import DashboardGraph from './DashboardGraph';
import RecentTrades from './RecentTrades';

class Dashboad extends Component {
    render() {
        return (
            <Fragment>
                <DashboardGraph />
                <RecentTrades />
            </Fragment>
        );
    }
}

export default Dashboad;