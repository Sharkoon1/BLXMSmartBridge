
/* transforms the formular of the "value adjustment algorithm" to an equation that can be resolved
*  takes Values from the monitoring service and processes it with the pq-formular
*/

function getAdjustmentValue (BLXM_CHEAP, USD_CHEAP, BLXM_EXPANSIVE, USD_EXPANSIVE){

    let p;
    let q;
    
    p = BLXM_EXPANSIVE*2;
    q = Math.pow(BLXM_EXPANSIVE, 2)
    q = q-(BLXM_EXPANSIVE*USD_EXPANSIVE)/(USD_CHEAP/BLXM_CHEAP)
    
    let root1, root2;
    
    // take input from the user
    let a = 1
    let b = p
    let c = q
    
    // calculate discriminant
    let discriminant = b * b - 4 * a * c;
    
    // condition for real and different roots
    if (discriminant > 0) {
        root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        root2 = (-b - Math.sqrt(discriminant)) / (2 * a);

        return root1;
    }
    
    // condition for real and equal roots
    else if (discriminant == 0) {
        root1 = root2 = -b / (2 * a);

        return root1;

    }
    
    // if roots are not real
    else {
        let realPart = (-b / (2 * a)).toFixed(2);
        let imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);

      return root1;

    }}

    module.exports = getAdjustmentValue;
