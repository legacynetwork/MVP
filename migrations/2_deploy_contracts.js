var Legacy = artifacts.require("./Legacy.sol");

module.exports = function (deployer, network, accounts) {
  var tPoL = 90;
  var beneficiaries = ['0x343295b49522cfc38af517c58ebb78565c42ed95'];
  var messageAdds = ['0x7d5a99f603f231d53a4f39d1521f98d2e8bb279cf29bebfd0687dc98458e7f89'];
  deployer.deploy(Legacy, tPoL, beneficiaries, messageAdds);
};
