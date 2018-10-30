require('jsdom-global')()

// workaround to avoid bug introduced by jsdom-global
window.Date = Date;

global.expect = require('expect')

const Vue = require('vue');
const Vuetify = require('vuetify');
const Web3 = require('web3');

Vue.use(Vuetify);
window.addEventListener('load', function () {
  if (typeof web3 !== 'undefined') {
    console.log('Web3 injected browser: OK.')
    window.web3 = new Web3(window.web3.currentProvider)
  } else {
    console.log('Web3 injected browser: Fail. You should consider trying MetaMask.')
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }
})
