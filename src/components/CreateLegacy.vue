<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm1 >
        <h2 class="display-2  mb-3">Setup your Legacy Contract</h2>
        <v-divider></v-divider>

        <v-form ref="form">

          <!-- "Your Beneficiaries" section -->
          <h3 class="display-1 pl-4 mb-3 mt-5">Your beneficiaries</h3>
          <v-flex
            v-for="(row, i) in beneficiaries"
            :key="`A-${i}`"
          >
            <v-card class="backgroundSecondaryCardColor mb-3">
              <v-card-text class="pb-0 pt-0">
                <v-layout align-center row wrap>
                  <v-flex xs12 sm1>
                    <v-icon size="50">account_box</v-icon>
                  </v-flex>
                  <v-flex d-flex xs12 sm4>
                    <v-text-field
                      v-model="row.ethAddress"
                      label="Ethereum address"
                      :counter="42"
                      dark
                      :rules="ethAddressRules"
                    ></v-text-field>
                  </v-flex>
                  <v-flex d-flex xs12 sm6>
                    <v-textarea
                      v-model="row.beneficiaryMessage"
                      :rules="newMessageRules"
                      label="Write a message to your beneficiary..."
                      auto-grow
                      rows="1"
                      dark
                      required
                    ></v-textarea>
                  </v-flex>
                  <v-layout row wrap class="text-align-center">
                    <v-flex xs12 sm1 mr-2>
                      <v-icon size="50">vpn_key</v-icon>
                    </v-flex>
                    <v-flex d-flex xs12 sm7>
                      <v-text-field
                        v-model="row.personalKey"
                        label="Your beneficiary's personal decryption key"
                        required
                        :rules="secretRules"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-flex d-flex xs12 sm1>
                    <v-btn
                      @click="removeEthAddress(`${i}`);"
                      color="error"
                      flat>
                      <v-icon>clear</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex text-xs-center text-md-right>
            <v-btn
              @click="addBeneficiary"
              color="grey"
              flat
              value="recent"
              class="warning"
              fab>
              <v-icon>add</v-icon>
            </v-btn>
          </v-flex>

          <!-- "Your Secret Keepers" section -->
          <h3 class="display-1 pl-4 mb-3">Your Secret Keepers</h3>
          <v-flex xs12>
            <p>You must add at least two secret keepers. We recommend three or
              more. Be sure to choose people you trust.</p>
          </v-flex>
            <v-flex
              v-for="(row, i) in secretKeepers"
              :key="`K-${i}`"
            >
              <v-card class="backgroundSecondaryCardColor mb-3">
                <v-card-text class="pt-0">
                  <v-layout align-center row wrap>
                    <v-flex xs12 sm1>
                      <v-icon size="50">account_box</v-icon>
                    </v-flex>
                    <v-flex d-flex xs12 sm4>
                      <v-text-field
                        v-model="row.ethAddress"
                        label="Ethereum address"
                        :counter="42"
                        dark
                        :rules="ethAddressRules"
                      ></v-text-field>
                    </v-flex>
                    <v-flex d-flex xs12 sm1 offset-sm6>
                      <v-btn
                        @click="removeSecretKeeper(`${i}`);"
                        color="error"
                        flat>
                        <v-icon>clear</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>

          <v-flex text-xs-center text-md-right>
            <v-btn
              @click="addSecretKeeper"
              color="grey"
              flat
              value="recent"
              class="warning"
              fab
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-flex>

          <!-- "Contract settings" section -->
          <h3 class="display-1 pl-4 mb-2">Contract settings</h3>
          <ContractParameterCard
            label="Time in days"
            headline="Proof of Life Timer"
            helperText="In order for the contract to know that you are still
              alive, you'll need to provide us proof of life regularly by
              reseting a timer. Tell us how long (in  days) you want this timer
              to be (eg. 30)."
            icon="timelapse"
            v-model="tPol"
            inputType="inputNumber"
            :rules="tPolRules"
          />

          <ContractParameterCard
            label="Recovery threshold"
            headline="Recovery Threshold"
            helperText="Tell us what is the minimum number of secret keepers
            required to unlock your Legacy contract. You must choose a number
            <code>k</code> such that <code>2 <= k <= n</code>, where
            <code>n</code> is the total number of secret keepers."
            icon="lock"
            v-model="k"
            inputType="inputNumber"
            :rules="kRules"
          />

          <ContractParameterCard
            label="Your secret phrase"
            headline="Your Secret Phrase"
            helperText="Insert a random secret phrase, it will be used to
                  generate the shared keys that you will then distribute
                  to your secret keepers. We recommend to destroy it or keep
                  it to yourself one we are done."
            icon="vpn_key"
            v-model="secretPhrase"
            :rules="secretRules"
          />

          <v-flex>
            <v-alert
              :value="true"
              type="error"
              dismissible
              transition="scale-transition"
              v-if="contractCreationError"
            >
              {{contractCreationErrorMsg}}
            </v-alert>
          </v-flex>
          <v-flex text-xs-center class="mt-4">
            <v-btn @click="clear" color="grey" class="accent">clear</v-btn>
            <v-btn @click="submit" color="warning" class="textGrey" light> submit</v-btn>
          </v-flex>
        </v-form>

        <v-flex v-if="isLoading">
          <div class="text-xs-center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </v-flex>
      </v-flex>
    </v-layout>

    <v-layout row id="result" >
      <v-flex xs12 sm10 offset-sm1 >
        <v-flex sm12 xs12 v-if="feedbackMsg">
          <v-flex xs12>
            <v-alert
              :value="true"
              type="success"
              dismissible
              transition="scale-transition"
              class="fontLarge"
            >
              {{feedbackMsg}}
            </v-alert>
          </v-flex>
          <v-flex xs12>
            <v-card color="error" class="white--text">
              <v-card-title class="text-sm-left" primary-title>
                <v-flex d-flex xs12 md1>
                  <v-icon size="50">warning</v-icon>
                </v-flex>
                <v-flex d-flex xs12 md4>
                  <p class="headline">Save the following information carefully:</p>
                </v-flex>
                <v-flex d-flex xs12 md7>
                 <p>Ethereum contract address: {{instance.address}}</p>
                </v-flex>
              </v-card-title>
            </v-card>
          </v-flex>
          <v-flex
            v-for="(beneficiary, i) in beneficiaries"
            :key="i"
          >
            <v-card color="#1262B2">
              <v-card-title class="text-sm-left" primary-title>
                <v-layout row wrap align-center>
                  <v-flex d-flex xs12 md1>
                    <v-icon size="50">account_box</v-icon>
                  </v-flex>
                  <v-flex d-flex xs12 md4 class="headline">
                    Beneficiary {{i+1}}:
                  </v-flex>
                  <v-flex d-flex xs12 md7 class="fontLarge">
                    {{beneficiary.ethAddress}}
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text class="pt-0">
                <v-layout row wrap align-center class="fontLarge">
                  <v-flex xs12 md7 offset-md5 text-xs-left>
                    <v-icon size="30">attach_file</v-icon>
                    <a v-bind:href="generateInfuraUrl(i)">File link</a>
                  </v-flex>
                </v-layout>
                <v-layout row wrap align-center class="fontLarge">
                  <v-flex xs12 md7 offset-md5 text-xs-left>
                    <v-icon size="30" class="mr-1">vpn_key</v-icon>
                    Personal decryption key: <i>{{beneficiary.personalKey}}</i>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex
            v-for="(keeper, j) in secretKeepers"
            :key="j"
          >
            <v-card color="#1262B2">
              <v-card-title class="text-sm-left" primary-title>
                <v-layout row wrap align-center>
                  <v-flex d-flex xs12 md1>
                    <v-icon size="50">account_box</v-icon>
                  </v-flex>
                  <v-flex d-flex xs12 md4 class="headline">
                    Secret Keeper {{j+1}}:
                  </v-flex>
                  <v-flex d-flex xs12 md7 class="fontLarge">
                    {{keeper.ethAddress}}
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-card-text class="pt-0">
                <v-layout row wrap align-center class="fontLarge">
                  <v-flex xs12 md7 offset-md5 text-xs-left>
                    <v-icon size="30" class="mr-1">vpn_key</v-icon>
                    Secret share: <i>{{keeper.secretShare}}</i>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
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
  import ContractParameterCard from '@/components/ContractParameterCard'

  export default {
    data () {
      return {
        tPol: '',
        instance: {},
        isLoading: false,
        beneficiaries: [{
          ethAddress: "",
          beneficiaryMessage: "",
          file: {
              name: '',
              path: '',
          },
          personalKey: ""
        }],
        feedbackMsg: '',
        ipfsHashs: [],
        beneficiariesMessages: [],
        beneficiariesMessagesToUpload: [],
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid'
        ],
        newMessageRules: [
          v => !!v || 'A message is required'
        ],
        tPolRules: [
          v => !!v || 'This field is required',
          v => /^[0-9]+$/.test(v) || 'A number is required'
        ],
        ethAddressRules: [
          v => !!v || 'An Ethereum address is required',
          v => /^(0x){1}[0-9a-fA-F]{40}$/i.test(v) || 'Please input a valid address'
        ],
        contractCreationError: false,
        contractCreationErrorMsg: "Something went wrong. Please try again later.",
        secretKeepers: [{
          ethAddress: "",
          secretShare: "",
          secretShareHash: ""
        }],
        k: "",
        kRules: [
          v => !!v || 'This field is required',
          v => /^[0-9]+$/.test(v) || 'A number is required',
          v => v >= 2 || 'Please choose a number greater or equal than 2',
          v => v <= this.secretKeepers.length || "Please choose a number smaller or equal than the total number of keepers in your contract"
        ],
        secretPhrase: "",
        secretRules: [
          v => !!v || 'This field is required'
        ]
      }
    },
    created: function () {
      Legacy.init();
    },
    components: {
      ContractParameterCard
    },
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          console.log("Setting up contract...");
          this.isLoading = true;
          this.beneficiariesMessagesToUpload =
            this.getMessagesToUploadFromBeneficiaries(this.beneficiaries);
          ipfs.add(this.beneficiariesMessagesToUpload, (err, ipfsHashs) => {
            if (err) {
              console.error("Error while uploading your messages to IPFS:"
                + err);
              this.isLoading = false;
              this.contractCreationError = true;
            } else {
              this.ipfsHashs = ipfsHashs;
              Legacy.createInstance(
                this.tPol,
                this.buildAddressArray(this.beneficiaries),
                this.buildCidArray(ipfsHashs),
                this.buildKeyHashArray(),
                this.buildAddressArray(this.secretKeepers),
                this.buildShareHashArray(),
                this.k
              ).then(instance => {
                console.log("Contract successfully deployed: "+ instance);
                this.isLoading = false;
                this.instance = instance;
                this.feedbackMsg = "Your messages have been successfully stored.";
                // TODO: scroll to result
              }).catch(err => {
                this.isLoading = false;
                this.contractCreationError = true;
                console.error(err);
              });
            }
          });
        }
      },
      clear () {
        this.$refs.form.reset();
        this.feedbackMsg = '';
        this.beneficiaries = [{
          ethAddress: "",
          beneficiaryMessage: "",
          file: {
              name: '',
              path: '',
          },
          personalKey: ""
        }];
        this.secretKeepers = [{
          ethAddress: "",
          secretShare: "",
          secretShareHash: ""
        }];
      },
      getMessagesToUploadFromBeneficiaries: function(beneficiaries){
        let beneficiariesMessages = [];
        let msgToUpload = "";
        let key = "";
        let CryptoJS = require("crypto-js");
        for(var i=0; i < beneficiaries.length; i++ ){
          var messageTimeStamp = "\n\nMessage timestamp: " + new Date() + " " + i;
          msgToUpload =  beneficiaries[i].beneficiaryMessage + messageTimeStamp;
          if(beneficiaries[i].personalKey) {
            key = beneficiaries[i].personalKey;
            // first encrytion layer
            msgToUpload =  CryptoJS.AES.encrypt(msgToUpload, key).toString();
            // second encryption layer
            msgToUpload =  CryptoJS.AES.encrypt(msgToUpload, this.secretPhrase).toString();
            console.log("msg to upload:" +  msgToUpload);
          }
          beneficiariesMessages.push({
            content: Buffer.from(msgToUpload)
          });
        }
        return beneficiariesMessages;
      },
      buildAddressArray: function(arr) {
        var addressArr = [];
        for(var i=0; i < arr.length; i++ ){
          addressArr.push(arr[i].ethAddress);
        }
        return addressArr;
      },
      buildCidArray: function (ipfsHashs) {
        console.log("IPFS hash:", ipfsHashs);
        var ipfsHashsList = [];
        for(var i=0; i < ipfsHashs.length; i++ ){
          console.log("IPFS path:", ipfsHashs[i].path);
          ipfsHashsList.push(util.ipfsHashToBytes(ipfsHashs[i].path))
        }
        return ipfsHashsList;
      },
      buildKeyHashArray: function () {
        var arr = [];
        for(var i=0; i<this.beneficiaries.length; i++){
          arr.push(web3.sha3(this.beneficiaries[i].personalKey));
        }
        return arr;
      },
      buildShareHashArray: function () {
        const crypto = require('crypto');
        let nShares = parseInt(this.secretKeepers.length);
        let threshold = parseInt(this.k);
        let hexSecret = Buffer.from(this.secretPhrase).toString('hex');
        let checksum = crypto.createHash('sha256').update(hexSecret).digest('hex').substr(56);
        let checkedHexSecret = hexSecret + checksum;
        let secretShares = shamir.generateShares(checkedHexSecret, nShares, threshold);
        let arr = []
        for(var i = 0; i < nShares; i++) {
          arr.push(web3.sha3(secretShares[i]));
          this.secretKeepers[i].secretShare = secretShares[i];
        }
        return arr;
      },
      addBeneficiary: function() {
        this.beneficiaries.push({
          ethAddress: "",
          beneficiaryMessage: "",
          file: {
              name: '',
              path: '',
          },
          personalKey: ""
        });
      },
      removeEthAddress: function(index) {
        this.beneficiaries.splice(index, 1);
      },
      generateInfuraUrl: function (CID) {
        return "https://ipfs.infura.io/ipfs/" + this.ipfsHashs[CID].path;
      },
      addSecretKeeper: function() {
        this.secretKeepers.push({
          ethAddress: "",
          secretShare: "",
          secretShareHash: ""
        });
      },
      removeSecretKeeper: function(index) {
        this.secretKeepers.splice(index,1);
      }
    }
  }
</script>

<style>
.fileContainer {
    overflow: hidden;
    position: relative;
}

.fileContainer [type=file] {
    cursor: inherit;
    display: block;
    font-size: 999px;
    filter: alpha(opacity=0);
    min-height: 100%;
    min-width: 100%;
    opacity: 0;
    position: absolute;
    right: 0;
    text-align: right;
    top: 0;
}

.fileContainer [type=file] {
    cursor: pointer;
}

</style>
