const mongoose = require("mongoose");

const Profit = new mongoose.Schema({
	Profit: { type: Number, default: 0 },
	isBSC: { type: Boolean, default: true },
	isArbitrageSwap: { type: Boolean, default: true }
},{
	timestamps: true 
});

module.exports = mongoose.model("Profit", Profit);