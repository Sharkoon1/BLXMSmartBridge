import React, { Component, Fragment } from 'react';
import DashboardGraph from './DashboardGraph';
import Poolsize from './Poolsize';
import WalletOverview from './WalletOverview';

class Dashboad extends Component {
    render() {
        return (
            <Fragment>
                <WalletOverview />
                <Poolsize />
                <DashboardGraph />
            </Fragment>
        );
    }
}

export default Dashboad;