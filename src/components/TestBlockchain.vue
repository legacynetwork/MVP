<template>
  <v-container grid-list-md text-xs-center>
  
    <v-layout row wrap text-md-center>
      <v-flex my-4 sm12>
        <h1>1. Contract Creation</h1>
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
    <v-layout text-md-center>
      <v-flex><v-btn @click="createContract" color="success">Create Contract</v-btn></v-flex>
    </v-layout>

    <v-divider my-4></v-divider>

    <v-layout row wrap text-md-center>
      <v-flex my-4 sm12 xs12>
        <h1>2. Check Contract Creation</h1>
      </v-flex>
      <v-flex>
      <p>After creating a contract, the property Legacy.instance should point to the new contract abstraction. Check it!</p>
      </v-flex>      
    </v-layout>
    <v-layout row wrap text-md-center>
      <v-flex><v-btn @click="getContractAddress" color="success">Get contract address</v-btn></v-flex>
    </v-layout>
    <v-layout row wrap text-md-center>
      <v-flex><p>{{contractAddress}}</p></v-flex>
    </v-layout>  
    <v-layout row wrap text-md-center>
      <v-flex><v-btn @click="getBeneficiaryAddress" color="success">Get beneficiary address</v-btn></v-flex>
    </v-layout>
    <v-layout row wrap text-md-center>
      <v-flex><p>{{fetchedBeneficiaryAddress}}</p></v-flex>
    </v-layout>
    <v-layout row wrap text-md-center>
      <v-flex><v-btn @click="getMessageAddress" color="success">Get message IPFS address</v-btn></v-flex>
    </v-layout>
    <v-layout row wrap text-md-center>
      <v-flex><p>{{fetchedMessageAddress}}</p></v-flex>
    </v-layout>    
  
  </v-container>

  </div>
</template>

<script>
  import Legacy from '@/js/legacy'

   export default {    
    data () {
      return {        
        beneficiaryAddress: "0x76361ef9d5e0090003Ce140f7310023e9De006Da",        
        messAddress: "0X7D5A99F603F231D53A4F39D1521F98D2E8BB279CF29BEBFD0687DC98458E7F89",
        ethAddressRules: [
          v => !!v || 'An Ethereum address is required',
          v => /^(0x){1}[0-9a-fA-F]{40}$/i.test(v) || 'ETH address must be valid'
        ],
        ethAddressErrors: '',
        userAddress: window.web3.eth.accounts[0],
        contractAddress: '',
        fetchedBeneficiaryAddress: '',
        fetchedMessageAddress: '',
      }
    },
    beforeCreate: function () {
      Legacy.init().catch(err => {
        console.log(err)
      })      
    },        
    methods: {      
      createContract: function() {
        let messAddresses = [this.messAddress]
        let beneficiaryAddresses = [this.beneficiaryAddress]
        console.log(messAddresses, beneficiaryAddresses)
        Legacy.createContract(beneficiaryAddresses, messAddresses)
        .catch(
          err => {
          console.log(err)
        })        
      },
      getContractAddress: function() {
        this.contractAddress = Legacy.instance.address;
      },
      getBeneficiaryAddress: function() {
        Legacy.getBeneficiary(0).then( benef => {
          this.fetchedBeneficiaryAddress = benef;
        })
        .catch(err => {
          console.log(err)
        })
      },
      getMessageAddress: function() {
        Legacy.getBeneficiaryMessageAddress(this.beneficiaryAddress).then( messAdd => {
          this.fetchedMessageAddress = messAdd
        })
        .catch(err => {
          console.log(err)
        })

      }
    }
  }
</script>