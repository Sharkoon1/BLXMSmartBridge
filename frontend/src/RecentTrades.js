import React, { Fragment } from 'react';
import "./style/RecentTrades.css"

import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

const recentTrades = [
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 },
    { date: "16.01.2022, 16:05", fromTo: "BSC -> ETH", priceBeforeSwapBSC: 2.3, priceBeforeSwapETH: 2.3, adjustmentValue: 3.5, priceAfterSwapBSC: 2.3, priceAfterSwapETH: 2.3 }
  ];
  

  const columns = [
    {
      dataField: "date",
      text: "Date",
      sort: true
    },
    {
      dataField: "fromTo",
      text: "Trade from to"
    },
    {
      dataField: "priceBeforeSwapBSC",
      text: "Price BSC Before ",
      sort: true
    },
    {
      dataField: "priceBeforeSwapETH",
      text: "Price ETH Before",
      sort: true
    },
    {
      dataField: "adjustmentValue",
      text: "Adjustment Value",
      sort: true
    },
    {
      dataField: "priceAfterSwapBSC",
      text: "Price BSC After",
      sort: true
    },
    {
      dataField: "priceAfterSwapETH",
      text: "Price ETH After",
      sort: true 
    }
  ];


function RecentTrades(props) {
    return (
        <Fragment>
        <h1 className='headingRecentTrades'>Recent Trades</h1>
        
        <div className='recentTradesBox'>
            <BootstrapTable className="recentTradesTable" bootstrap4 keyField="date" data={recentTrades} columns={columns} className={"text-xs-center"} pagination={paginationFactory({ sizePerPage: 4 })} />
        </div>
        </Fragment>
    );
}

export default RecentTrades;