const { createLogger, format, transports } = require("winston");

module.exports = createLogger({
	transports: [


		new transports.Console({
			level: "error",
		}),

		new transports.Console({
			level: "warn",
		}),

		new transports.Console({
			level: "info",
		}),

		new transports.Console({
			level: "http",
		}),

		new transports.Console({
			level: "verbose",
		}),

		new transports.Console({
			level: "debug",
		}),

		new transports.Console({
			level: "silly",
		})

	],

	format:format.combine(
		format.timestamp({format: "MMM-DD-YYYY HH:mm:ss"}),
		format.align(),
		format.colorize(),
		format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
	),

});


