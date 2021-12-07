const mongoose = require("mongoose");

const PoolPrice = new mongoose.Schema({
	PoolPrice: { type: Number, default: 0 },
	Network: { type: String}
},{
    timestamps: true 
});

module.exports = mongoose.model("PoolPrice", PoolPrice);