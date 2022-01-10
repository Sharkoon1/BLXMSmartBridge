const constants =  require("../../src/constants");

const Arbitrage = artifacts.require("BscArbitrage");
module.exports = function(_deployer) {
  _deployer.deploy(Arbitrage, constants.BLXM_TOKEN_ADDRESS_BSC, constants.USD_TOKEN_ADRESS_BSC);
};