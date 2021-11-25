
//Liquidity Pool expansive
var  BLXM_CHEAP= 1310;     // Liquidity pool Pancacke Swap
var  USD_CHEAP= 5000;    // Liquidity pool Pancacke Swap
//Liquidity Pool cheap
var BLXM_EXPANSIVE = 233.9606946033066;     // Liquidity pool Uniswap
var USD_EXPANSIVE = 19234;     // Liquidity pool Uniswap

const value = require('./GetAdjustmentValueService');
console.log(value.getAdjustmentValue(BLXM_CHEAP, USD_CHEAP, BLXM_EXPANSIVE, USD_EXPANSIVE));


const englishCode = "en-US";
const spanishCode = "es-ES";
function getAboutUsLink(language){
    switch (language.toLowerCase()){
      case englishCode.toLowerCase():
        return '/about-us';
      case spanishCode.toLowerCase():
        return '/acerca-de';
    }
    return '';
}
module.exports = getAboutUsLink;
