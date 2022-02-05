const constants =  require("../../src/constants");

const Arbitrage = artifacts.require("BscArbitrage");
module.exports = function(_deployer) {
  _deployer.deploy(Arbitrage, "0x6703bB029a9B2d44f8e21Ec7f635C5A0b06743Fa", "0x42db14A9f863F12A9265365C1901A36e58c862fC");
};