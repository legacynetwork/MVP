import contract from 'truffle-contract'
import LegacyContract from '@contracts/Legacy.json'

const Legacy = {

  contract: null,

  instance: null,

  init: function () {
    this.contract = contract(LegacyContract)
    this.contract.setProvider(window.web3.currentProvider)
  },

  createInstance: function (tPol, beneficiaryAddresses, beneficiaryMessages) {
    let self = this

    return new Promise(function (resolve, reject) {
      self.contract.new(tPol, beneficiaryAddresses, beneficiaryMessages, { from: window.web3.eth.accounts[1], gas: 3000000 }).then(instance => {
        self.instance = instance
        console.log("Nouvelle instance !! : " + instance.address)
        resolve(instance)
      }).catch(err => {
        rejected(err)
      })
    })
  },

  deploy: function (tPol, beneficiaryAddresses, beneficiaryMessages) {
    let self = this

    return new Promise(function (resolve, reject) {
      self.contract.deployed(tPol, beneficiaryAddresses, beneficiaryMessages, { from: window.web3.eth.accounts[0], gas: 3000000 }).then(instance => {
        self.instance = instance
        resolve(instance)
      }).catch(err => {
        reject(err);
      })
    })
  },

  getOwnerAddress: function () {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.getOwner()
        .then(tx => {
          resolve(tx);
          console.log(tx);
        }).catch(err => {
          reject(err)
        })
      })
  },

  getPoLTimerLen: function () {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.tPoL(
      ).then(tx => {
        resolve(tx);
      }).catch(err => {
        reject(err);
      })
    })
  },

  addBeneficiaries: function(benefAdds, messAdds) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.addBeneficiaries(benefAdds, messAdds, { from: window.web3.eth.accounts[0], gas: 3000000 })
      .catch(err => {
        reject(err);
      })
    })
  },

  getBeneficiary: function(index) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.beneficiaries.call(index)
      .then(tx => {
        resolve(tx);
      }).catch(err => {
        reject(err);
      })
    })

  },

  getBenefiaciesAddresses: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.getBeneficiaries(
        { from: window.web3.eth.accounts[0] }
      ).then(beneficiariesAddress => {
        resolve(beneficiariesAddress)
      }).catch(err => {
        reject(err);
      })
    })

  },

  getBenefiaciesMessage: function (beneficaryAddress) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.getBeneficiarieMessage(beneficaryAddress,
        { from: window.web3.eth.accounts[0] }
      ).then(beneficiariesMessages => {
        resolve(beneficiariesMessages)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default Legacy
