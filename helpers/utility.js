const { ethers } = require("ethers");

exports.toWei = function (amount) {
	return ethers.utils.parseEther(String(amount));
};


exports.BigNumberMin = function (bigNumberOne, bigNumberTwo) {
	let min;

	if(bigNumberOne.lt(bigNumberTwo))
	{
		min = bigNumberOne;
	}

	else {
		min = bigNumberTwo;
	}

	return min;
};


