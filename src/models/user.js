const mongoose = require("mongoose");

const User = new mongoose.Schema({
    account: { type: String, unique: true },
    password: { type: String},
    isRegistered: { type: Boolean}
});

module.exports = mongoose.model("User", User);