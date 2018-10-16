import contract from 'truffle-contract'
import LegacyContract from '@contracts/Legacy.json'

const Legacy = {

  contract: null,

  instance: null,

  init: function () {
    let self = this;

    return new Promise(function (resolve, reject) {
      self.contract = contract(LegacyContract);
      self.contract.setProvider(window.web3.currentProvider);

      self.contract.deployed().then(instance => {        
        self.instance = instance;
        resolve();
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

}

export default Legacy
