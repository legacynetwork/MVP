import contract from 'truffle-contract'
import LegacyContract from '@contracts/Legacy.json'

const Legacy = {

  contract: null,
  instance: null,

  init: function () {
    this.contract = contract(LegacyContract);
    this.contract.setProvider(window.web3.currentProvider);
  },

  createInstance: function (
    tPol,
    beneficiaryAddresses,
    beneficiaryMessages,
    benefKeyHashes,
    keeperAddresses,
    keeperShareHahes,
    k
  ) {
    let self = this;

    return new Promise(function (resolve, reject) {
      self.contract.new(
        tPol,
        beneficiaryAddresses,
        beneficiaryMessages,
        benefKeyHashes,
        keeperAddresses,
        keeperShareHahes,
        k,
        {from: window.web3.eth.accounts[0], gas: 3000000}
      ).then(instance => {
        self.instance = instance;
        console.log("New contract instance at address: " + instance.address);
        resolve(instance);
      }).catch(err => {
        console.error("Error while creating a new contract instance: " + err);
        reject(err);
      });
    });
  },

  getSmartContractInstance: function (smartContractAddress) {
    let self = this;

    return new Promise(function (resolve, reject) {
      self.contract.at(smartContractAddress).then(instance => {
        self.instance = instance;
        instance.userAddress = web3.eth.accounts[0];
        resolve(instance);
      }).catch(err => {
        console.error(err);
        reject(err);
      });
    });
  },

  getOwnerAddress: function () {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.getOwnerAddress()
      .then(tx => {
        console.log(tx);
        resolve(tx);
      }).catch(err => {
        reject(err);
      });
    });
  },

  getPoLTimerLen: function () {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.tPoL()
      .then(tx => {
        resolve(tx);
      }).catch(err => {
        reject(err);
      });
    });
  },

  getProofOfLife: function () {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.getProofOfLife(
      ).then(isDead => {
        resolve(isDead);
      }).catch(err => {
        reject(err);
      });
    });
  },

  addBeneficiaries: function (benefAdds, messAdds) {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.addBeneficiaries(
        benefAdds,
        messAdds,
        {from: window.web3.eth.accounts[0], gas: 3000000})
      .catch(err => {
        reject(err);
      });
    });
  },

  getBeneficiary: function (index) {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.beneficiaries.call(index)
      .then(tx => {
        resolve(tx);
      }).catch(err => {
        reject(err);
      });
    });
  },

  getBeneficiaryAddresses: function () {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.getBeneficiaries(
        {from: window.web3.eth.accounts[0]}
      ).then(beneficiariesAddress => {
        resolve(beneficiariesAddress);
      }).catch(err => {
        reject(err);
      });
    });
  },

  giveProofOfLife: function () {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.giveProofOfLife(
        {from: window.web3.eth.accounts[0]}
      )
      .then(() => {resolve();})
      .catch(err => {
        reject(err);
      });
    });
  },

  setPoLTime: function (tPol) {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.setPoLTimerLength(
        tPol,
        {from: window.web3.eth.accounts[0]}
      )
      .then(() => {resolve();})
      .catch(err => {
        reject(err);
      });
    });
  },

  getTime: function () {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.getNow(
        {from: window.web3.eth.accounts[0]}
      ).then(beneficiariesAddress => {
        resolve(beneficiariesAddress);
      }).catch(err => {
        reject(err);
      });
    });
  },

  isBeneficiary: function (userAddress) {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.isBeneficiary(
        userAddress,
        {from: window.web3.eth.accounts[0]}
      ).then(isBeneficiary => {
        resolve(isBeneficiary);
      }).catch(err => {
        reject(err);
      });
    });
  },

  getTZero: function () {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.tZero.call(
        {from: window.web3.eth.accounts[0]}
      ).then(tZero => {
        resolve(tZero);
      }).catch(err => {
        reject(err);
      });
    });
  },

  getBeneficiaryMessageCID: function (beneficaryAddress) {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.getMessageCID(
        beneficaryAddress,
        {from: window.web3.eth.accounts[0]}
      ).then(beneficiariesMessages => {
        resolve(beneficiariesMessages);
      }).catch(err => {
        reject(err);
      });
    });
  },

  isKeeper: function (userAddress) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.instance.isKeeper(userAddress)
      .then(isKeeper => {
        resolve(isKeeper);
      }).catch(err => {
        reject(err);
      });
    });
  },

  saveSecretShare: function (keeperAdd, secretShare) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.instance.saveSecretShare(
        keeperAdd,
        secretShare,
        {from: window.web3.eth.accounts[0]}
      )
      .then(() => {resolve();})
      .catch(err => {
        reject(err);
      });
    });
  }

}

export default Legacy
