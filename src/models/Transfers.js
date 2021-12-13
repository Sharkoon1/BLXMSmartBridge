const mongoose = require("mongoose");

const Transfer = new mongoose.Schema({
	hash: { type: Number, default: 0 },
	network: { type: String, default: true },
},{
	timestamps: true 
});

module.exports = mongoose.model("Transfer", Transfer);