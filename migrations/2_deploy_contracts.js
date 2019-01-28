var Legacy = artifacts.require("./Legacy.sol");

module.exports = function (deployer, network, accounts) {
  // changing this number will affect the outcome of the test script
  var tPoL = 0;
  var beneficiaries = ['0x343295b49522cfc38af517c58ebb78565c42ed95'];
  var messageAdds =
    ['0x653FF0972E8F4DE31F067ED73D8D808F2B4A5AD5E1E3E64DEFC12D51B53B0094'];
  var keyHashes =
    ['0x653FF0972E8F4DE31F067ED73D8D808F2B4A5AD5E1E3E64DEFC12D51B53B0095'];
  var secretKeepers = [
    '0x343295b49522cfc38af517c58ebb78565c42ed95',
    '0x343295b49522cfc38af517c58ebb78565c42ed96'
  ];
  var secretShareHashes = [
    '0x653FF0972E8F4DE31F067ED73D8D808F2B4A5AD5E1E3E64DEFC12D51B53B0096',
    '0x653FF0972E8F4DE31F067ED73D8D808F2B4A5AD5E1E3E64DEFC12D51B53B0097',
  ];
  deployer.deploy(
    Legacy,
    tPoL,
    beneficiaries,
    messageAdds,
    keyHashes,
    secretKeepers,
    secretShareHashes,
    2
  );
};
