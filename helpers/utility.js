const { ethers } = require("ethers");

exports.toWei = function (amount) {
	return ethers.utils.parseEther(String(amount));
};


exports.bigNumberMin = function (bigNumberOne, bigNumberTwo) {
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


exports.bigNumberMul = function (bigNumberOne, bigNumberTwo) {
	let weiUnit = ethers.BigNumber.from((10**18).toString());

	return (bigNumberOne.mul(bigNumberTwo)).div(weiUnit);
};

