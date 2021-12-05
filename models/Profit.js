const mongoose = require("mongoose");

const Profit = new mongoose.Schema({
	Profit: { type: Number, default: 0 },
	DateTime: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Profit", Profit);