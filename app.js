var logger = require("./logger/logger")
const winston = require('winston');
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var apiResponse = require("./helpers/apiResponse");
var cors = require("cors");
require("dotenv").config();
const ArbitrageService = require("./service/ArbitrageService");
const BridgeService = require("./service/BridgeService");
// DB connection

//var bridgeService = new BridgeService();
//var arbitrageService = new ArbitrageService(bridgeService);

var app = express();

//different logger experessions 
logger.error("error");
logger.warn("warn");
logger.info("info");
logger.http("http");
logger.verbose("verbose")
logger.debug("debug")
logger.silly("silly")



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//To allow cross-origin requests
app.use(cors());

//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", function (req, res) {
	return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
	if (err.name == "UnauthorizedError") {
		return apiResponse.unauthorizedResponse(res, err.message);
	}
});

module.exports = app;

