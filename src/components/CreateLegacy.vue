<template>
  <div class="createLegacy">
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm10 offset-sm1 >
          <h2 class="display-2  mb-3">Create a Legacy</h2>
          <v-divider></v-divider>
          <v-form ref="form">
            <div class="backgroundPrimaryCardColor">
              <v-card-title class="text-sm-left pb-0" primary-title>
                <h3 class="display-1 pl-4 mb-3">Your beneficiaries</h3>
                <v-card-text class="pb-0 pt-0">
                  <v-flex
                    v-for="(row, i) in beneficiaries"
                    :key="`A-${i}`"
                  >
                    <v-card class="backgroundSecondaryCardColor">
                      <v-card-title class="text-sm-left pb-0" primary-title>
                        <v-card-text class="pt-0">
                          <v-layout align-center row wrap>
                            <v-flex xs12 sm1>
                              <v-icon size="50">account_box</v-icon>
                            </v-flex>
                            <v-flex d-flex xs12 sm4>
                              <v-text-field v-model="row.ethAddress"
                                              label="Beneficiary address"
                                              :error-messages="ethAddressErrors"
                                              :counter="42"
                                              dark
                                              :rules="ethAddressRules"
                                ></v-text-field>
                              </v-flex>
                              <v-flex d-flex xs12 sm6>
                                <v-textarea
                                  v-model="row.beneficiaryMessage"
                                  :error-messages="newMessageErrors"
                                  :rules="newMessageRules"
                                  label="Write a message to your beneficiary..."
                                  auto-grow
                                  rows="1"
                                  dark
                                  required
                                ></v-textarea>
                              </v-flex>
                              <v-layout row wrap>
                                <v-flex xs12 sm1 mr-2>
                                  <v-icon size="50">vpn_key</v-icon>
                                </v-flex>
                                <v-flex d-flex xs12 sm7>
                                  <v-text-field v-model="row.personalKey"
                                    label="Your beneficiary's personal decryption key"
                                  ></v-text-field>
                                </v-flex>
                              </v-layout>
                              <v-flex d-flex xs12 sm1>
                                <v-btn
                                  @click="removeEthAddress(`A-${i}`);"
                                  color="error"
                                  flat
                                >
                                  <v-icon>clear</v-icon>
                                </v-btn>

                              </v-flex>
                            </v-layout>
                          </v-card-text>
                        </v-card-title>
                      </v-card>
                  </v-flex>
                </v-card-text>

                <v-flex text-xs-center text-md-right>
                  <v-btn
                    @click="addBeneficiary"
                    color="grey"
                    flat
                    value="recent"
                    class="warning"
                    fab
                  >
                    <v-icon>add</v-icon>
                  </v-btn>
                </v-flex>
              </v-card-title>
            </div>
            <div class="backgroundPrimaryCardColor mt-5">
              <v-card-title class="text-sm-left" primary-title >
                <h3 class="display-1 pl-4 mb-3">Contract settings</h3>
                <v-card-text class="pb-0 pt-0">
                  <v-flex d-flex xs12>
                    <v-card class="backgroundSecondaryCardColor">
                      <v-card-title class="text-sm-left" primary-title>
                        <span class="headline">Proof of Life Timer</span><br>
                        <v-card-text class="pb-0 pt-0">
                          <v-layout align-center row wrap>
                            <v-flex d-flex xs12 sm1>
                              <v-icon size="50">timelapse</v-icon>
                            </v-flex>
                            <v-flex d-flex xs12 sm8>
                            <p> In order for the contract to know that you are still
                              alive, you'll need to provide us proof of life regularly by reseting a timer.
                              Tell us how long (in  days) you want this timer to be (eg. 30).</p>
                            </v-flex>
                            <v-flex d-flex xs12 sm3>
                              <v-text-field
                                v-model="tPol"
                                outline
                                height="100"
                                label="Time in days"
                                :error-messages="tPolErrors"
                                :rules="tPolRules"
                                dark
                                class="inputNumber tPolTxtField"
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card-title>
                    </v-card>
                  </v-flex>
                </v-card-text>
              </v-card-title>
            </div>
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
              >
                <p>{{feedbackMsg}}</p>
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
              :key=i
            >
              <v-layout row wrap>
                <v-flex xs12>
                  <v-card color="#1262B2">
                    <v-card-title class="text-sm-left" primary-title>
                      <v-flex d-flex xs12 md1>
                        <v-icon size="50">account_box</v-icon>
                      </v-flex>
                      <v-flex d-flex xs12 md4>
                        <p>Beneficiary {{i+1}}:</p>
                      </v-flex>
                      <v-flex d-flex xs12 md7>
                        <p>{{beneficiary.ethAddress}}</p>
                      </v-flex>
                      <v-flex xs12 md7 offset-md5 text-lg-left>
                          <v-icon size="30">attach_file</v-icon>
                          <a v-bind:href="generateInfuraUrl(i)">File link</a>
                      </v-flex>
                      <v-flex xs12 md7 offset-md5 text-lg-left>
                            <v-icon size="30" class="mr-1">vpn_key</v-icon>
                            Personal decryption key: <i>{{beneficiary.personalKey}}</i>
                      </v-flex>
                    </v-card-title>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import Legacy from '@/js/legacy'
  import ipfs from "@/js/ipfs"
  import util from "@/js/util"

   export default {
    data () {
      return {
        myName: '',
        myEmail: '',
        myEthAddress: '',
        tPol: 90,
        newMessageErrors: '',
        emailErrors: '',
        ethAddressErrors: '',
        tPolErrors: '',
        uploadedFiles: [],
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
        ownerAddress: '',
        beneficiariesAddresses: [],
        beneficiariesMessages: [],
        beneficiariesMessagesToUpload: [],
        ipfsHashsFromIPFS: '',
        addressRequested: '',
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
        ]
      }
    },
    created: function () {
      Legacy.init();
    },
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          console.log("New instance!");
          this.isLoading = true;
          this.beneficiariesMessagesToUpload =
            this.getMessagesToUploadFromBeneficiaries(this.beneficiaries);
          console.log("Messages to upload: " + this.beneficiariesMessagesToUpload);
          ipfs.add(this.beneficiariesMessagesToUpload, (err, ipfsHashs) => {
            if (err) {
              console.error(err);
            }
            this.ipfsHashs = ipfsHashs;
            Legacy.createInstance(
              this.tPol,
              this.formatBenefiariesAddresses(this.beneficiaries),
              this.formatIpfsHashs(ipfsHashs))
            .then(instance => {
              console.log(instance)
              this.isLoading = false;
              this.instance = instance;
              this.feedbackMsg = "Your messages have been successfully stored."
              // TODO: scroll to result
            }).catch(err => {
              console.log(err)
            })
          })
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
          }]
      },
      deploy: function () {
        console.log("Deploy!")
        Legacy.deploy(10, [0x95424f81efa2f4c1687c560a2c0f6ec99e7cb91a], ['Salut']).then(instance => {
            console.log(instance)
          }).catch(err => {
            console.log(err)
          })
      },
      getOwnerAddress: function () {
        Legacy.getOwnerAddress().then(ownerAddress => {
          this.ownerAddress = ownerAddress
          console.log("Address is: " + ownerAddress)
        })
      },
      getBenefiaciesAddresses: function () {
        console.log("Get Owner address!")
        Legacy.getBenefiaciesAddresses().then(beneficiariesAddresses => {
          this.beneficiariesAddresses = beneficiariesAddresses
          console.log("Address is: " + beneficiariesAddresses)
        })
      },
      getBenefiaciesCID: function () {
        console.log("Get Owner address!")
        Legacy.getBenefiaciesMessage(this.addressRequested).then(beneficiariesMessages => {
          let ipfsHash = util.bytesToIpfsHash(beneficiariesMessages)
          this.beneficiariesMessages = ipfsHash
          console.log("Address is: " + ipfsHash)
        })
      },
      getMessagesToUploadFromBeneficiaries: function(beneficiaries){
        let beneficiariesMessages = [];
        let msgToUpload = "";
        let key = "";
        let CryptoJS = require("crypto-js");
        for(var i=0; i < beneficiaries.length; i++ ){
          var messageTimeStamp = "\n\nMessage created: " + new Date() + " " + i;
          msgToUpload =  beneficiaries[i].beneficiaryMessage + messageTimeStamp;
          if(beneficiaries[i].personalKey) {
            key = beneficiaries[i].personalKey;
            msgToUpload =  CryptoJS.AES.encrypt(msgToUpload, key).toString();
            console.log("msg to upload:" +  msgToUpload);
          }
          beneficiariesMessages.push({
            content: Buffer.from(msgToUpload)
          })
        }
        return beneficiariesMessages;
      },
      formatBenefiariesAddresses: function(beneficiaries) {
        var beneficiariesAddress = [];
        for(var i=0; i < beneficiaries.length; i++ ){
          beneficiariesAddress.push(beneficiaries[i].ethAddress);
        }
        return beneficiariesAddress;
      },
      formatIpfsHashs: function(ipfsHashs) {
        console.log("IPFS hash:", ipfsHashs);
        var ipfsHashsList = [];
        for(var i=0; i < ipfsHashs.length; i++ ){
          console.log("IPFS path:", ipfsHashs[i].path);
          ipfsHashsList.push(util.ipfsHashToBytes(ipfsHashs[i].path))
        }
        return ipfsHashsList;
      },
      addBeneficiary: function() {
        this.feedbackMsg = '';
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
      addRow: function() {
        this.uploadedFiles.push({
          title: "",
          description: "",
          file: {
              name: 'Choose File'
          }
        });
      },
      removeFileRow: function(index) {
        this.uploadedFiles.splice(index, 1);
      },
      removeEthAddress: function(index) {
        this.beneficiaries.splice(index, 1);
        this.feedbackMsg = '';
      },
      setFilename: function(event, row) {
        var file = event.target.files[0];
        row.file = file
      },
      generateInfuraUrl: function (CID) {
        return "https://ipfs.infura.io/ipfs/"+this.ipfsHashs[CID].path;
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
.v-input.inputNumber input{
  font-size:50px;
  max-height: 100px;
}
</style>
