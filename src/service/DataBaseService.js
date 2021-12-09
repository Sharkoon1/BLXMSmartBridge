const Profit = require("./../models/Profit");
const mongoose = require("mongoose");
require("dotenv").config();

class DataBaseService {

	constructor() {
		const MONGODB_URL = process.env.MONGODB_URL;
		mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
			//don't show the log when it is test
			if (process.env.NODE_ENV !== "test") {
				console.log("Connected to %s", MONGODB_URL);
				console.log("App is running ... \n");
				console.log("Press CTRL + C to stop the process. \n");
			}
		})
			.catch(err => {
				console.error("App starting error:", err.message);
				process.exit(1);
			});
		this.db = mongoose.connection;
	}

	QueryData(query, model) {
		return model.find(query);
	}

	QueryById(id, model) {
		return model.findById(id);
	}

	AddData(query, model) {
		model.create(query);
	}

	UpdateById(id, query, model) {
		model.findByIdAndUpdate(id, query, { new: true });
	}
}


module.exports = new DataBaseService();