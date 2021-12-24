var express = require("express");
var monitoringRouter = require("./monitoring");
var swapRouter = require("./swap");
var transferRouter = require("./transfer");
let singleArbitrageRouter =  require("./singleArbitrage");
let toggleArbitrageRouter =  require("./toggleArbitrage");
let getLiquidityRouter =  require("./getLiquidity");

var app = express();
app.use("/monitoring/", monitoringRouter);
app.use("/swap/", swapRouter);
app.use("/transfer/", transferRouter);
app.use("/singleArbitrage/", singleArbitrageRouter);
app.use("/toggleArbitrage/", toggleArbitrageRouter);
app.use("/getLiquidity/", getLiquidityRouter);
module.exports = app;