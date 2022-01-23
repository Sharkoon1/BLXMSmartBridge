var express = require("express");
var monitoringRouter = require("./monitoring");
var swapRouter = require("./swap");
let arbitrageRouter =  require("./arbitrage");
const oracleRouter = require("./oracle")

var app = express();
app.use("/monitoring/", monitoringRouter);
app.use("/swap/", swapRouter);
app.use("/arbitrage/", arbitrageRouter);
app.use("/oracle/", oracleRouter);
module.exports = app;