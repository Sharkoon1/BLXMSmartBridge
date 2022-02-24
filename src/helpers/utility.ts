import BigNumber from "bignumber.js";

export function compareUpTo(a, b, decimals) : boolean {
	return a.toFixed(decimals) === b.toFixed(decimals);
}

export function bigNumberToFloat(bigNumber: BigNumber) : number {
	return Number.parseFloat(bigNumber.toString());
}