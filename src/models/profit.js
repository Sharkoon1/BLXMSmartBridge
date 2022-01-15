const mongoose = require("mongoose");

const Profit = new mongoose.Schema({
	profit: { type: Number, default: 0 },
	network: { type: String, default: true },
	isArbitrageSwap: { type: Boolean, default: true }
},{
	timestamps: true 
});

module.exports = mongoose.model("Profit", Profit);