const constants =  require("../../src/constants");

const Arbitrage = artifacts.require("EthArbitrage");
module.exports = function(_deployer) {
  _deployer.deploy(Arbitrage, "0xb5382dfBA952a41a2F2d0B7313C3578b83d32be0", "0x22853d67597b47fb11c7569ab507530216ca56a4");
};