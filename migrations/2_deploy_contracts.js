var Legacy = artifacts.require("./Legacy.sol");

module.exports = function (deployer) {
  var tPoL = 90;
  deployer.deploy(Legacy, tPoL);
};
