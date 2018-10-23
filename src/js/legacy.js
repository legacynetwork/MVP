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
      self.contract.new(tPol, beneficiaryAddresses, beneficiaryMessages, { from: window.web3.eth.accounts[0], gas: 3000000 }).then(instance => {
        self.instance = instance
        console.log("Nouvelle instance !! : " + instance.address)
        resolve(instance)
      }).catch(err => {
        console.log("Create instance error !! : " + err)
        reject(err)
      })
    })
  },

  getSmartContractInstance: function (smartContractAddress) {
    let self = this

    return new Promise(function (resolve, reject) {
      self.contract.at(smartContractAddress).then(instance => {
        self.instance = instance
        console.log("Get instance !! : " + instance.address)
        instance.userAddress = web3.eth.accounts[0];
        resolve(instance)
      }).catch(err => {
        console.log("Get instance error !! : " + err)
        reject(err)
      })
    })
  },

  // deploy: function (tPol, beneficiaryAddresses, beneficiaryMessages) {
  //   let self = this

  //   return new Promise(function (resolve, reject) {
  //     self.contract.deployed(tPol, beneficiaryAddresses, beneficiaryMessages, { from: window.web3.eth.accounts[0], gas: 3000000 }).then(instance => {
  //       self.instance = instance
  //       resolve(instance)
  //     }).catch(err => {
  //       reject(err);
  //     })
  //   })
  // },

  getOwnerAddress: function () {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.getOwnerAddress()
        .then(tx => {
          console.log(tx);
          resolve(tx);
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

  getProofOfLife: function () {
    let self = this;

    return new Promise((resolve, reject) => {
      self.instance.getProofOfLife(
      ).then(isDead => {
        resolve(isDead);
      }).catch(err => {
        reject(err);
      })
    })
  },

  addBeneficiaries: function (benefAdds, messAdds) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.addBeneficiaries(benefAdds, messAdds, { from: window.web3.eth.accounts[0], gas: 3000000 })
        .catch(err => {
          reject(err);
        })
    })
  },

  getBeneficiary: function (index) {
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

  giveProofOfLife: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.giveProofOfLife(
        { from: window.web3.eth.accounts[0] }
      ).catch(err => {
        reject(err);
      })
    })
  },
  setPoLTime: function (tPol) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.setPoLTimerLength(tPol,
        { from: window.web3.eth.accounts[0] }
      ).catch(err => {
        reject(err);
      })
    })
  },


  getTime: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.getNow(
        { from: window.web3.eth.accounts[0] }
      ).then(beneficiariesAddress => {
        resolve(beneficiariesAddress)
      }).catch(err => {
        reject(err);
      })
    })
  },

  isBeneficiary: function (userAddress) {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.isBeneficiary(userAddress,
        { from: window.web3.eth.accounts[0] }
      ).then(isBeneficiary => {
        resolve(isBeneficiary)
      }).catch(err => {
        reject(err);
      })
    })
  },

  getTZero: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.tZero.call(
        { from: window.web3.eth.accounts[0] }
      ).then(tZero => {
        resolve(tZero)
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
