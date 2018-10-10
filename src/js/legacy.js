import contract from 'truffle-contract'
import LegacyContract from '@contracts/Legacy.json'

const Legacy = {

  contract: null,

  instance: null,

  init: function () {
    let self = this

    return new Promise(function (resolve, reject) {
      self.contract = contract(LegacyContract)
      self.contract.setProvider(window.web3.currentProvider)

      self.contract.deployed().then(instance => {
        self.instance = instance
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  getOwnerAddress: function () {
    let self = this

    return new Promise((resolve, reject) => {
      self.instance.owner.call(
        { from: window.web3.eth.accounts[0] }
      ).then(ownerAddress => {
        resolve(ownerAddress)
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
  checkLegacy: function (heirEthAddress, legacyContractEthAddress) {
    let self = this

    return "true"
  }
}

export default Legacy
