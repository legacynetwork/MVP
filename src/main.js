import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import './css/style.css'
import Web3 from 'web3'
import router from './router'

Vue.use(Vuetify, {
  theme: {
    primary: 'white',
    secondary: '#76B4FA',
    accent: '#FFF10D',
    error: '#BF1E13',
    grey: '#333'
  }
})

window.addEventListener('load', function () {
  if (typeof web3 !== 'undefined') {
    console.log('Web3 injected browser: OK.')
    window.web3 = new Web3(window.web3.currentProvider)
  } else {
    console.log('Web3 injected browser: Fail. You should consider trying MetaMask.')
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    template: '<App/>',
    router,
    components: { App }
  })
})
