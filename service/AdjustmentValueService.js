
/* transforms the formular of the "value adjustment algorithm" to an equation that can be resolved
*  takes Values from the monitoring service and processes it with the pq-formular
*/

exports.getAdjustmentValue = function (BLXM_CHEAP, USD_CHEAP, BLXM_EXPENSIVE, USD_EXPENSIVE) {

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
		return root1;
	}

	// condition for real and equal roots
	else if (discriminant == 0) {
		root1 = -b / (2 * a);
		return root1;

	}

	// if roots are not real
	else {
		// Something went wrong, return -1 as indicator!
		return -1;
	}
};
