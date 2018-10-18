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
    // beneficiaryAddresses = ["0x95424f81efa2f4c1687c560a2c0f6ec99e7cb91a"];
    // beneficiaryMessages = "qm4156476541657454;qm415674989754654;";

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
        reject(err)
      })
    })
  },

  getOwnerAddress: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.getOwner(
        { from: window.web3.eth.accounts[0] }
      ).then(ownerAddress => {
        resolve(ownerAddress)
      }).catch(err => {
        reject(err)
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
        reject(err)
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
  },

  start: function (newBetDuration, newRedistributionPercentage) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.start({ from: window.web3.eth.accounts[0], gas: 3000000 }
      ).then(tx => {
        resolve(tx)
      }).catch(err => {
        reject(err)
      })
    })
  },
}

export default Legacy
