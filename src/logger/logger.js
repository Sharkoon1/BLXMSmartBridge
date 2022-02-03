const { createLogger, format, transports } = require("winston");
const app = require("../app");
const Transport = require("winston-transport");
require("winston-mongodb");

class EventLogTransport extends Transport {
	constructor(opts) {
		super(opts);
	}
	log(info, callback) {
		app.logEvent.emit("logMessage", `${new Date(info.timestamp).toLocaleTimeString() + " " + info.message}`);

		callback();
	}
}


module.exports = createLogger({
	transports: [
		new transports.Console({
			format: format.combine(
				format.timestamp({format: "MMM-DD-YYYY HH:mm:ss"}),
				format.align(),
				format.colorize(),
				format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
			)
		}),
		new EventLogTransport({
			format: format.combine(
				format.timestamp({format: "MMM-DD-YYYY HH:mm:ss"}),
				format.align(),
				format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
			),
		}),
		new transports.MongoDB({
			db: process.env.MONGODB_URL,
			options: {
				useNewUrlParser: true,
				useUnifiedTopology: true
			},
			collection: "logs",
			format: format.combine(format.timestamp(), format.json()),
			decolorize: true
		})
	],
});
