const mongoose = require("mongoose");

const PoolPrice = new mongoose.Schema({
	PoolPrice: { type: String },
	Network: { type: String}
},{
    timestamps: true 
});

module.exports = mongoose.model("PoolPrice", PoolPrice);