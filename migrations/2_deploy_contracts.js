var Legacy = artifacts.require("./Legacy.sol");

module.exports = function (deployer, network, accounts) {
  var tPoL = 90;
  var beneficiaries = ['0x343295b49522cfc38af517c58ebb78565c42ed95'];
  var messageAdds = '12347896;'
  deployer.deploy(Legacy, tPoL, beneficiaries, messageAdds);
};
