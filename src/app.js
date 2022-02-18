require("dotenv").config();
var express = require("express");
var cookieParser = require("cookie-parser");
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var apiResponse = require("./helpers/apiResponse");
var debug = require("debug")("rest-api-nodejs-mongodb:server");
var http = require("http");
var cors = require("cors");

var EventEmitter = require("events").EventEmitter;
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


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "8080");
app.set("port", port);
 
/**
  * Create HTTP server.
  */
 
var server = http.createServer(app);
 
/**
  * Listen on provided port, on all network interfaces.
  */
 
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

const io = require("socket.io")(server,{
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

io.on("connection", client => {
	console.log("Connected!");
	client.on("disconnect", () => { /* … */ });
});


var logEvent = new EventEmitter();

exports.logEvent = logEvent;

logEvent.on("logMessage", function(msg) {
	io.sockets.emit("log", msg);
}); 


logEvent.on("cycleCompleted", function(isCompleted) {
	io.sockets.emit("cycleCompleted", isCompleted);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== "listen") {
		throw error;
	}

	var bind = typeof port === "string"
		? "Pipe " + port
		: "Port " + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
	case "EACCES":
		console.error(bind + " requires elevated privileges");
		process.exit(1);
		break;
	case "EADDRINUSE":
		console.error(bind + " is already in use");
		process.exit(1);
		break;
	default:
		throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	var bind = typeof addr === "string"
		? "pipe " + addr
		: "port " + addr.port;
	debug("Listening on " + bind);
}

var DataService = require("./service/dataService");

(async () => {
	const queryIntervalSeconds = 30;

	setInterval(async () => { 
		await DataService.getPoolData();
	}, queryIntervalSeconds * 1000);
})();


module.exports = app;


