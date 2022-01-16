var express = require("express");
var monitoringRouter = require("./monitoring");
var swapRouter = require("./swap");
let arbitrageRouter =  require("./arbitrage");

var app = express();
app.use("/monitoring/", monitoringRouter);
app.use("/swap/", swapRouter);
app.use("/arbitrage/", arbitrageRouter);
module.exports = app;