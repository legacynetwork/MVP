<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm1 >
        <h2 class="display-2  mb-3">Claim a Legacy</h2>
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

      <v-flex xs12 sm10 offset-sm1 >
        <v-flex xs12 v-if="errorMessage">
          <v-alert
            :value="true"
            type="error"
            dismissible
            transition="scale-transition"
            >
            {{errorMessage}}
          </v-alert>
        </v-flex>
        <v-flex xs12 v-if="messageTestatorAlive">
          <v-alert
            :value="true"
            type="warning"
            dismissible
            transition="scale-transition"
            >
            {{messageTestatorAlive}}
          </v-alert>
        </v-flex>
        <v-flex xs12 v-if="messageIsNotBeneficiary">
          <v-alert
            :value="true"
            type="warning"
            dismissible
            transition="scale-transition"
          >
            {{messageIsNotBeneficiary}}
          </v-alert>
        </v-flex>
      </v-flex>

      <v-flex xs12 sm10 offset-sm1 >
        <v-flex xs12 v-if="sharedSecret">
          <v-layout row wrap>
            <v-flex xs12>
              <v-card color="#1262B2">
                <v-card-title primary-title >
                  <v-flex d-flex xs12 sm8 class="text-xs-left align-center">
                    <v-icon size="50">account_box</v-icon>
                      <h3>{{instance.userAddress}}</h3>
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
  import shamir from "@/js/shamir"

  export default {
    data () {
      return {
        instance: '',
        tPol: '',
        smartContractAddress: '',
        ethAddressErrors: '',
        errorMessage: '',
        messageTestatorAlive: '',
        messageIsNotBeneficiary: '',
        beneficiaryCID: '',
        beneficiaryMessage: '',
        personalKey: '',
        shares: [],
        unknownShares: 0,
        sharedSecret: '',
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
        this.sharedSecret = '';
        if (this.$refs.form.validate()) {
          Legacy.getSmartContractInstance(this.smartContractAddress).then(instance => {
            if(instance) {
              this.instance = instance;
              // check if user is one of the beneficiaries in this contract
              this.isBeneficiary(instance.userAddress);
            }
          }).catch(err => {
            this.errorMessage = "Could not find contract at given address.";
          })
        }
      },

      isBeneficiary: function (userAddress) {
        Legacy.isBeneficiary(userAddress).then(isBeneficiary => {
          if(isBeneficiary) {
            console.log("user is a beneficiary of this contract.")
            this.messageIsNotBeneficiary = '';
            this.getProofOfLife();
          } else {
            this.messageIsNotBeneficiary = "It seems that you are not a " +
             "beneficiary of this contract. Check your Metamask account";
          }
        })
      },

      getProofOfLife: function () {
        Legacy.getProofOfLife().then(isAlive => {
          if(!isAlive){
            this.messageTestatorAlive = '';
            this.getBeneficiaryCID();
          } else {
            this.messageTestatorAlive = "It seems that the contract owner " +
              "is still alive.";
          }
        })
      },

      getBeneficiaryCID: function () {
        Legacy.getBeneficiaryMessageCID(this.instance.userAddress)
        .then(beneficiaryCID => {
          let ipfsHash = util.bytesToIpfsHash(beneficiaryCID);
          this.beneficiaryCID = ipfsHash;
          console.log("IPFS CID: " + ipfsHash);
          this.getSharedSecret();
        })
        .catch(err => {
          this.errorMessage = "We are sorry. We couldn't retrive the IPFS " +
            "address of your message. Please try again another time.";
        });
      },

      getSharedSecret: function () {
        const crypto = require('crypto');
        this.instance.k().then(k => {
          var threshold = k.toNumber();
          this.instance.getSecretKeepers().then(keepers => {
            let n = keepers.length;
            for (var i = 0; i < n; i++) {
              this.instance.keeperData.call(keepers[i]).then(keeperData => {
                if (keeperData[0]) {  // secret has been saved in contract
                  this.shares.push(keeperData[0]);
                  if (this.shares.length >= threshold) {
                    // retrieve the secret with hex redundancy check code
                    var hexSecretRedCheck = shamir.deriveSecret(this.shares);
                    // isolate secret in hex form
                    var hexSecret = hexSecretRedCheck.substr(
                      0, hexSecretRedCheck.length - 8);
                    var storedChecksum = hexSecretRedCheck.substr(-8);
                    var derivedChecksum = crypto.createHash('sha256').update(hexSecret).digest('hex').substr(56);
                    if (storedChecksum != derivedChecksum) {
                      this.errorMessage = "Could not retrieve shared secret";
                      console.error(this.errorMessage);
                    }
                    this.sharedSecret = Buffer.from(hexSecret, 'hex').toString('utf8');
                  }
                } else {
                  this.unknownShares++;
                  if (this.unknownShares > n - threshold) {
                    console.log(this.unknownShares + ' ' + n + ' ' + threshold);
                    this.errorMessage = "Not enough shares to retrieve " +
                      "the shared secret.";
                  }
                }
              });
            }  // end for
          });
        });
      },  // getSharedSecret

      generateInfuraUrl: function () {
        return "https://ipfs.infura.io/ipfs/" + this.beneficiaryCID;
      },

      getMessage: function () {
        let CryptoJS = require("crypto-js");
        ipfs.files.cat(this.beneficiaryCID, (err, fileBuffer) => {
          let ciphertext = fileBuffer.toString();
          console.log("Encrypted message: " +  ciphertext);
          let bytes  = CryptoJS.AES.decrypt(ciphertext, this.sharedSecret);
          bytes  = CryptoJS.AES.decrypt(bytes.toString(CryptoJS.enc.Utf8),
            this.personalKey);
          this.beneficiaryMessage = bytes.toString(CryptoJS.enc.Utf8);
          console.log("Plaintext: " +  this.beneficiaryMessage);
          if (err) {
            console.error(err);
            this.errorMessage = err;
          }
        })
      },

    }
  }
</script>
