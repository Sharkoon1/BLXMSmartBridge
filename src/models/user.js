const mongoose = require("mongoose");

const User = new mongoose.Schema({
    account: { type: String }
});

module.exports = mongoose.model("User", User);