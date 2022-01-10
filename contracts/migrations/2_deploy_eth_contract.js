const constants =  require("../../src/constants");

const Arbitrage = artifacts.require("EthArbitrage");
module.exports = function(_deployer) {
  _deployer.deploy(Arbitrage, constants.BLXM_TOKEN_ADDRESS_ETH, constants.USD_TOKEN_ADRESS_ETH);
};