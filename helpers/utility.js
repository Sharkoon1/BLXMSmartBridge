const { ethers } = require("ethers");

exports.toWei = function (amount) {
	return ethers.utils.parseEther(String(amount));
};

