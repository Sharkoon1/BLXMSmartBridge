var express = require("express");
var monitoringRouter = require("./monitoring");
var arbitrageRouter =  require("./arbitrage");
var oracleRouter = require("./oracle");
var slippageRouter = require("./slippage");
var authorizationRouter = require("./authorization");
var maxSwapAmountRouter = require("./maxSwapAmount");
var environmentRouter = require("./environment");

var app = express();
app.use("/monitoring/", monitoringRouter);
app.use("/arbitrage/", arbitrageRouter);
app.use("/oracle/", oracleRouter);
app.use("/slippage/", slippageRouter);
app.use("/authorization", authorizationRouter);
app.use("/maxSwapAmount", maxSwapAmountRouter);
app.use("/environment", environmentRouter);
module.exports = app;