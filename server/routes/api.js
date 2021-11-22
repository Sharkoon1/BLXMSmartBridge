var express = require("express");
var monitoringRouter = require("./monitoring");
var swapRouter = require("./swap");

var app = express();
app.use("/monitoring/", monitoringRouter);
app.use("/swap/", swapRouter);

module.exports = app;