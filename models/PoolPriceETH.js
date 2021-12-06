const mongoose = require("mongoose");

const Profit = new mongoose.Schema({
	PoolPriceETH: { type: Number, default: 0 },
	DateTime: { type: Date, default: Date.now() }
},{
    timestamps: true 
});

module.exports = mongoose.model("PoolPriceETH", PoolPriceETH);