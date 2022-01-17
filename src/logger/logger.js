const { createLogger, format, transports } = require("winston");
const app = require("../app");
const Transport = require("winston-transport");
const util = require("util");


class EventLogTransport extends Transport {
	constructor(opts) {
		super(opts);
	}
	log(info, callback) {
	//	app.logEvent.emit("logMessage", info.message);

		callback();
	}
}


module.exports = createLogger({
	transports: [
		new transports.Console(),
		new EventLogTransport()
	],

	format:format.combine(
		format.timestamp({format: "MMM-DD-YYYY HH:mm:ss"}),
		format.align(),
		format.colorize(),
		format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
	),

});
