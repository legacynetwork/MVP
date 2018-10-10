var Legacy = artifacts.require("./Legacy.sol");

module.exports = function (deployer, network, accounts) {
  var tPoL = 90;
  var beneficiaries = [];
  var messageAdds = []
  deployer.deploy(Legacy, tPoL, beneficiaries, messageAdds);
};
