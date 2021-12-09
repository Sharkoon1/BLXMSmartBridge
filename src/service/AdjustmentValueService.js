const { ethers } = require("ethers");
const logger = require("../logger/logger");

/* transforms the formular of the "value adjustment algorithm" to an equation that can be resolved
*  takes Values from the monitoring service and processes it with the pq-formular
*/

exports.getAdjustmentValue = function (BLXM_CHEAP, USD_CHEAP, BLXM_EXPENSIVE, USD_EXPENSIVE) {
	BLXM_CHEAP = ethers.utils.formatEther(BLXM_CHEAP);
	USD_CHEAP = ethers.utils.formatEther(USD_CHEAP);
	BLXM_EXPENSIVE = ethers.utils.formatEther(BLXM_EXPENSIVE);
	USD_EXPENSIVE = ethers.utils.formatEther(USD_EXPENSIVE);


	let p;
	let q;

	p = BLXM_EXPENSIVE * 2;
	q = Math.pow(BLXM_EXPENSIVE, 2);
	q = q - (BLXM_EXPENSIVE * USD_EXPENSIVE) / (USD_CHEAP / BLXM_CHEAP);

	let root1;

	// take input from the user
	let a = 1;
	let b = p;
	let c = q;

	// calculate discriminant
	let discriminant = b * b - 4 * a * c;

	// condition for real and different roots
	if (discriminant > 0) {
		root1 = (-b + Math.sqrt(discriminant)) / (2 * a);

		logger.info("Adjustment value BLXM: " + root1);

		return ethers.utils.parseEther(String(root1));
	}

	// condition for real and equal roots
	else if (discriminant == 0) {
		root1 = -b / (2 * a);
		
		return ethers.utils.parseEther(String(root1));

	}

	// if roots are not real
	else {
		// Something went wrong, return -1 as indicator!
		return -1;
	}
};

exports.getAdjustmentValueUsd = function (blxmCHEAP, usdCHEAP, blxmEXPENSIVE, usdEXPENSIVE) {
	blxmCHEAP = ethers.utils.formatEther(blxmCHEAP);
	usdCHEAP = ethers.utils.formatEther(usdCHEAP);
	blxmEXPENSIVE = ethers.utils.formatEther(blxmEXPENSIVE);
	usdEXPENSIVE = ethers.utils.formatEther(usdEXPENSIVE);

	let constantExpensive = (usdEXPENSIVE * blxmEXPENSIVE);
	let constantCheap = (usdCHEAP * blxmCHEAP);


	let adjustmentValue = (Math.sqrt(Math.pow(blxmCHEAP, 2) * constantCheap * constantExpensive + 2 * blxmCHEAP * blxmEXPENSIVE * constantCheap * constantExpensive + 
		Math.pow(blxmEXPENSIVE, 2) * constantCheap * constantExpensive) + 
		Math.pow(blxmCHEAP, 2) * (-usdCHEAP) - 2 * blxmCHEAP * blxmEXPENSIVE * usdCHEAP + blxmCHEAP * constantCheap - Math.pow(blxmEXPENSIVE, 2) * 
		usdCHEAP + blxmEXPENSIVE * constantCheap) / (Math.pow(blxmCHEAP,2) + 2 *blxmCHEAP * blxmEXPENSIVE + Math.pow(blxmEXPENSIVE, 2));

	logger.info("Adjustment value USD: " + adjustmentValue);
	
	return ethers.utils.parseEther(String(adjustmentValue)); 
};

