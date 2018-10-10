<template>
  <div class="editLegacy">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs10 offset-xs1>
          <v-form ref="form">
            <h2>Check the state of the legacy</h2>
            <v-text-field
              v-model="myEthAddress"
              :error-messages="ethAddressErrors"
              :counter="42"
              :rules="ethAddressRules"
              label="Your Ethereum address"
              required
            ></v-text-field>          
            <v-text-field
              v-model="contractEthAddress"
              :error-messages="ethAddressErrors"
              :counter="42"
              :rules="ethAddressRules"
              label="Your Ethereum contract address"
              required
            ></v-text-field>   
            {{checkResult}}              

            <v-btn @click="submit" color="success">Check</v-btn>
            <v-btn @click="clear" color="warning">clear</v-btn>
          </v-form>
        </v-flex>
        <v-alert
          v-model="displayResultMessageOK"
          dismissible
          type="success"
          >
          Your Legacy could be unlocked. Go to "Get my legacy" to unlock it.
        </v-alert>
        <v-alert
          v-model="displayResultMessageKO"
          dismissible
          type="success"
          >
          Your Legacy is loked.
        </v-alert>        
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import Legacy from '@/js/legacy'

  export default {
    name: 'checkLegacy',
    data () {
      return {
        myEthAddress: '',
        displayResultMessageOK: false,
        displayResultMessageKO: false,
        ethAddressErrors: '',        
        contractEthAddress: '',
        checkResult: '',
        ethAddressRules: [
          v => !!v || 'ETH address is required',
          v => /^(0x){1}[0-9a-fA-F]{40}$/i.test(v) || 'ETH address must be valid'
        ]        
      }
    },
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          this.checkResult = Legacy.checkLegacy(this.myEthAddress, this.contractEthAddress);
          if(this.checkResult == "true"){
            displayResultMessageOK = true;
          }else{
            displayResultMessageKO = true;
          }
        }
      },
      clear () {
        this.$refs.form.reset()
      }
    }    
  }
</script>