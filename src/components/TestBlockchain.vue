<template>
  <div class="editLegacy">
    <v-container grid-list-md text-xs-center>
    
    <v-layout row wrap text-md-center>
      <v-flex my-4 sm12>
        <h1>Contract Creation</h1>
      </v-flex>
      <v-flex>
      <p>Creates a new instance of the Legacy contract with a single beneficiary and default parameters:
        <br>Beneficiary address: 0x76361ef9d5e0090003Ce140f7310023e9De006Da
        <br>Message IPFS hash: 0X7D5A99F603F231D53A4F39D1521F98D2E8BB279CF29BEBFD0687DC98458E7F89
      </p>
      </v-flex>
    </v-layout>
    <v-layout align-center row wrap>
      <v-flex d-flex xs12 sm5>
        <v-text-field v-model="beneficiaryAddress"
          label="Beneficiary address"
          :error-messages="ethAddressErrors"
          :counter="42"
          :rules="ethAddressRules"                                
        ></v-text-field>
      </v-flex>
      <v-flex d-flex xs12 sm7>
        <v-text-field v-model="messAddress"
          label="Beneficiary message address (Base58)"
        ></v-text-field>
      </v-flex>      
    </v-layout>    
    <v-layout text-md-right>
      <v-flex><v-btn @click="createContract" color="success">Create Contract</v-btn></v-flex>
    </v-layout>



    <!-- <v-layout row wrap align-center>
      <v-flex text-md-right sm6>        
        <v-btn @click.native="getTimerLength">Get PoL Timer Length:</v-btn>
      </v-flex>      
      <v-flex sm6>
        {{tPoL}}
      </v-flex>
    </v-layout>
    <v-layout row align-center>    
      <v-flex text-md-right sm6>        
        <v-btn @click.native="getOwnerAddress">Get Owner Address:</v-btn>
      </v-flex>
      <v-flex sm6>
        {{ownerAddress}}
      </v-flex>
    </v-layout> -->

    </v-container>
  </div>
</template>

<script>
  import Legacy from '@/js/legacy'

   export default {
    //name: 'editLegacy',
    data () {
      return {        
        beneficiaryAddress: "0x76361ef9d5e0090003Ce140f7310023e9De006Da",        
        messAddress: "0X7D5A99F603F231D53A4F39D1521F98D2E8BB279CF29BEBFD0687DC98458E7F89",
        ethAddressRules: [
          v => !!v || 'An Ethereum address is required',
          v => /^(0x){1}[0-9a-fA-F]{40}$/i.test(v) || 'ETH address must be valid'
        ],
        ethAddressErrors: '',
        ownerAddress: 0x0000000000000000000000000000000000000000,
        tPoL: 0,
        benefAddress: 0x0000000000000000000000000000000000000000,
        benefIndex: '',
        userAddress: window.web3.eth.accounts[0],                
        feedbackMg: "",          
      }
    },
    beforeCreate: function () {
      Legacy.init().catch(err => {
        console.log(err)
      })      
    },
    created: function () {
      //console.log(Legacy.instance) // -> null
      // Legacy.getOwnerAddress().then(owner => {
      //     this.ownerAddress = owner
      //   })
    },
    methods: {
      addEthAddress: function() {
        this.beneficiaryAddresses.push("")
        this.beneficiaryMessages.push("")
      },
      removeEthAddress: function(index) {
        this.beneficiaryAddresses.splice(index, 1);
        this.beneficiaryMessages.push("")
      },
      createContract: function() {
        let messAddresses = ['0X7D5A99F603F231D53A4F39D1521F98D2E8BB279CF29BEBFD0687DC98458E7F89']
        let beneficiaryAddresses = [this.beneficiaryAddress]
        console.log(messAddresses, beneficiaryAddresses)
        Legacy.createContract(beneficiaryAddresses, messAddresses)        
        .catch(
          err => {
          console.log(err)
        })

        // let messAddresses = []
        // for (let i = 0; i <= this.beneficiaryAddresses.length; i++) {
        //   messAddresses.push('0X7D5A99F603F231D53A4F39D1521F98D2E8BB279CF29BEBFD0687DC98458E7F89')          
        // }
        // console.log(messAddresses, this.beneficiaryAddresses)
        // Legacy.createContract(this.beneficiaryAddresses, messAddresses)
        // .catch(
        //   err => {
        //   console.log(err)
        // })
      },
      getOwnerAddress: function () {
        Legacy.getOwnerAddress().then(owner => {
          this.ownerAddress = owner
          console.log(owner)          
        })
      },
      getTimerLength: function () {
        Legacy.getPoLTimerLen().then(tPoL => {
          this.tPoL = tPoL
        })
      },
      getBeneficiary: function () {
        console.log(this.benefIndex);
        Legacy.getBeneficiary(parseInt(this.benefIndex, 10)).then( benef => {
          this.benefAddress = benef;          
        })
        .catch(err => {
          console.log(err)
        })
      },
    }
  }
</script>