var express = require("express");
var path = require("path");
var EventEmitter = require("events").EventEmitter;
var cookieParser = require("cookie-parser");
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var apiResponse = require("./helpers/apiResponse");
var cors = require("cors");
require("dotenv").config();

var cronJobs = require("./jobs/CronJobs");
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));

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

app.use(function (req, res, next) {

	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
	res.setHeader("Access-Control-Allow-Credentials", true);

	next();
});

const server = require("http").createServer();

const io = require("socket.io")(server,{
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});


io.on("connection", client => {
	console.log("Connected!");
	client.on("event", data => { /* … */ });
	client.on("disconnect", () => { /* … */ });
});


var logEvent = new EventEmitter();

exports.logEvent = logEvent;

logEvent.on("logMessage", function(msg) {
	io.sockets.emit("log", msg);
});

server.listen(3002);

// register arbitrage cron job 
cronJobs.registerArbitrageJob();
cronJobs.stopTask();

module.exports = app;

