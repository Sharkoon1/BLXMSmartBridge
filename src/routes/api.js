var express = require("express");
var monitoringRouter = require("./monitoring");
var swapRouter = require("./swap");
var transferRouter = require("./transfer");
let singleArbitrageRouter =  require("./singleArbitrage");

var app = express();
app.use("/monitoring/", monitoringRouter);
app.use("/swap/", swapRouter);
app.use("/transfer/", transferRouter);
app.use("/singleArbitrage/", singleArbitrageRouter);
module.exports = app;