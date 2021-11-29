const mongoose = require("mongoose");

const Profit = new mongoose.Schema({
    Profit: { type: Number, default: 0 },
    DateTime: { type: Date, defaul: Date.now() }
})

module.exports = mongoose.model("Profit",Profit)