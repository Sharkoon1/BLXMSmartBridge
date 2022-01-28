var express = require("express");
var monitoringRouter = require("./monitoring");
var swapRouter = require("./swap");
var arbitrageRouter =  require("./arbitrage");
var oracleRouter = require("./oracle");
var slippageRouter = require("./slippage");
var authorizationRouter = require("./authorization");

var app = express();
app.use("/monitoring/", monitoringRouter);
app.use("/swap/", swapRouter);
app.use("/arbitrage/", arbitrageRouter);
app.use("/oracle/", oracleRouter);
app.use("/slippage/", slippageRouter);
app.use("/authorization", authorizationRouter)
module.exports = app;