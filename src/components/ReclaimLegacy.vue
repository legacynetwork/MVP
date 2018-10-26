<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm1 >
        <h2 class="display-2  mb-3">Reclaim a Legacy</h2>
        <v-divider></v-divider>
        <v-form ref="form">
            <div class="backgroundPrimaryCardColor">
              <v-card-title class="text-sm-left pb-0" primary-title>
                <h3 class="display-1 pl-4 mb-3">Your contract information</h3>
                <v-card-text class="pb-0 pt-0">
                  <v-layout align-center row wrap>
                    <v-flex d-flex xs12>
                      <v-text-field
                        v-model="smartContractAddress"
                        label="Smart contract address (0x...)"
                        :error-messages="ethAddressErrors"
                        :counter="42"
                        :rules="ethAddressRules"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
              </v-card-text>
            </v-card-title>
          </div>
          <v-flex text-xs-right class="mr-5">
            <v-btn
              @click="submit"
              color="grey"
              flat
              value="recent"
              class="warning"
            >
              Search
            </v-btn>
          </v-flex>
        </v-form>
      </v-flex>
    </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm10 offset-sm1 >
          <v-flex xs12 v-if="errorMessage">
            <v-alert
              :value="true"
              type="warning"
              dismissible
              transition="scale-transition"
              >
              <p>{{errorMessage}}</p>
            </v-alert>
          </v-flex>
          <v-flex xs12 v-if="messageTestatorAlive">
            <v-alert
              v-model="alertTestatorAlive"
              type="warning"
              dismissible
              transition="scale-transition"
              >
              <p>{{messageTestatorAlive}}</p>
            </v-alert>
          </v-flex>
          <v-flex xs12 v-if="messageIsBeneficiary">
            <v-alert
              v-model="alertIsBeneficiary"
              type="warning"
              dismissible
              transition="scale-transition"
            >
              <p>{{messageIsBeneficiary}}</p>
            </v-alert>
          </v-flex>
        </v-flex>
      </v-layout>
      <v-layout row id="result" >
        <v-flex xs12 sm10 offset-sm1 >
          <v-flex xs12 v-if="beneficiariesCID">
            <v-layout row wrap>
              <v-flex xs12>
                <v-card color="#1262B2">
                  <v-card-title primary-title >
                    <v-flex d-flex xs12 sm8 class="text-xs-left">
                      <p>
                        <v-icon size="50">account_box</v-icon>
                        {{instance.userAddress}}
                      </p>
                    </v-flex>
                    <v-flex d-flex xs12 sm4 class="text-xs-right">
                      <p><v-icon size="30">attach_file</v-icon><a v-bind:href="generateInfuraUrl()">File link</a></p>
                    </v-flex>
                  </v-card-title>
                  <v-card-text>
                    <v-flex d-flex xs12 text-xs-left>
                      <p>Please insert your personal decryption key to recover your message:</p>
                    </v-flex>
                    <v-flex d-flex xs12>
                      <v-text-field
                        v-model="personalKey"
                        type="password"
                        label="Your personal decryption key">
                      </v-text-field>
                    </v-flex>
                    <v-flex text-xs-right class="mr-5">
                      <v-btn
                        @click="getMessage"
                        color="grey"
                        flat
                        value="recent"
                        class="warning"
                      >
                        Decrypt my message
                      </v-btn>
                    </v-flex>
                    <v-flex xs12 sm12 v-if="beneficiaryMessage">
                      <div><h3>Your secret message:</h3></div>
                      <div><p><i>{{beneficiaryMessage}}</i></p></div>
                    </v-flex>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
  import Legacy from '@/js/legacy'
  import ipfs from "@/js/ipfs"
  import util from "@/js/util"

  export default {
    data () {
      return {
        instance: '',
        tPol: '',
        smartContractAddress: '',
        ethAddressErrors: '',
        errorMessage: '',
        messageTestatorAlive: '',
        messageIsBeneficiary: '',
        beneficiariesCID: '',
        beneficiaryMessage: '',
        personalKey: '',
        alertIsBeneficiary: true,
        alertTestatorAlive: true,
        time: '',
        tZero: '',
        ethAddressRules: [
          v => !!v || 'ETH address is required',
          v => /^(0x){1}[0-9a-fA-F]{40}$/i.test(v) || 'ETH address must be valid'
        ]
      }
    },
    created: function () {
      Legacy.init();
    },

  methods: {
      submit: function () {
        if (this.$refs.form.validate()) {
          Legacy.getSmartContractInstance(this.smartContractAddress).then(instance => {
            if(instance) {
              console.log("Get instance from vue :" + instance);
              this.instance = instance;
              // check if user is one of the beneficiaries in this contract
              this.isBeneficiary(instance.userAddress)
            }
          }).catch(err => {
            console.log("Error submit : " + err)
          })
        }
      },
      getPoLTimerLen: function () {
          Legacy.getPoLTimerLen().then(tPol => {
          this.tPol = tPol/24/60/60;
          console.log("tPol is: " + tPol);
        })
      },
      isBeneficiary: function (userAddress) {
        Legacy.isBeneficiary(userAddress).then(isBeneficiary => {
          if(isBeneficiary) {
            this.messageIsBeneficiary = '';
            this.getProofOfLife();
          } else {
            this.messageIsBeneficiary = "You are not a heir of this contract";
          }
        })
      },
      getProofOfLife: function () {
        Legacy.getProofOfLife().then(isAlive => {
          console.log("isAlive is: " + isAlive);
           // testing mod.
           // REPLACE BY LINE BELOW IN PRODUCTION
           // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          if(isAlive) {
          // if(!isAlive){
            this.messageTestatorAlive = '';
            this.getBenefiaciesCID();
          } else {
            this.messageTestatorAlive = "Contract owner is still alive. You can't get your legacy";
          }
        })
      },
      getBenefiaciesCID: function () {
        console.log("Get CID. User Address : " + this.instance.userAddress)
        Legacy.getBenefiaciesMessage(this.instance.userAddress).then(beneficiariesCID => {
          let ipfsHash = util.bytesToIpfsHash(beneficiariesCID)
          this.beneficiariesCID = ipfsHash
          console.log("Address is: " + ipfsHash)
        })
      },
      generateInfuraUrl: function () {
        console.log("url : " + this.beneficiariesCID.path);
        return "https://ipfs.infura.io/ipfs/"+this.beneficiariesCID;
      },
      getMessage: function () {
        let CryptoJS = require("crypto-js");
        ipfs.files.cat(this.beneficiariesCID,(err, fileBuffer) => {
          let ciphertext = fileBuffer.toString();
          console.log("Encrypted message: " +  ciphertext);
          let bytes  = CryptoJS.AES.decrypt(ciphertext, this.personalKey);
          this.beneficiaryMessage = bytes.toString(CryptoJS.enc.Utf8);
          console.log("Plaintext: " +  this.beneficiaryMessage);
          if (err) {
            console.error(err);
          }
        })
      },
      getTime: function () {
        console.log("Enter gettime");
          Legacy.getTime().then(time => {
          this.time = time;
          console.log("time is: " + time);
        })
      },
      getTZero: function () {
        console.log("Enter gettime");
          Legacy.getTZero().then(tZero => {
          this.tZero = tZero;
          console.log("tZero is: " + tZero);
        })
      }
    }
  }
</script>
