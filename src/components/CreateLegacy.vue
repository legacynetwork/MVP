<template>
  <div class="editLegacy">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <v-form ref="form">
            <h2>Your beneficiaries</h2>
            <v-flex  
              v-for="(row, i) in beneficiaries"
              :key="`A-${i}`"
              >
              <v-layout align-center row wrap>
                <v-flex d-flex xs12 sm5>
                  <v-text-field v-model="row.ethAddress"
                                label="Beneficiary address"
                                :error-messages="ethAddressErrors"
                                :counter="42"
                                :rules="ethAddressRules"                                
                  ></v-text-field>
                </v-flex>
                <v-flex d-flex xs12 sm6>
                  <v-textarea v-model="row.beneficiaryMessage"
                              :error-messages="newMessageErrors"
                              :rules="newMessageRules"
                              label="Beneficiary message"
                              auto-grow
                              rows="1"
                              required 
                  ></v-textarea>

                </v-flex>   
                <v-flex d-flex xs12 sm1>
                  <v-btn
                      @click="removeEthAddress(`A-${i}`);"
                      color="red"
                      flat
                      value="recent"
                      class="red lighten-5"
                    >
                      <v-icon>clear</v-icon>
                    </v-btn>
                </v-flex>             
              </v-layout>
            </v-flex>
            <v-flex>
              <v-btn
                @click="addBeneficiary"
                color="teal"
                flat
                value="recent"
                class="teal lighten-5"
              >
                <v-icon>add</v-icon>
                <span>Add beneficiary</span>
              </v-btn>
            </v-flex>
            
            <v-btn @click="submit" color="success">submit</v-btn>
            <v-btn @click="clear" color="warning">clear</v-btn>
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

      <v-layout row >
        <v-flex sm12 xs12 v-if="feedbackMsg">
          <v-flex xs12>
            <v-card color="blue-grey darken-2" class="white--text">
              <v-card-title class="text-sm-left" primary-title>
                <div>
                  <span class="headline">{{feedbackMsg}}</span><br>
                  <span>Ethereum contract address: {{instance.address}}</span><br>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>            
          <v-flex  
            v-for="(row, i) in beneficiaries"
            :key=i
            >
            <v-layout row wrap>
              <v-flex xs12>
                <v-card >
                  <v-card-title class="text-sm-left" primary-title>
                    <div>
                      <span class="headline">Beneficiary n°{{i+1}}</span><br>
                      <span>Ethereum address: {{row.ethAddress}}</span><br>
                      <span>Files link: <a v-bind:href="generateInfuraUrl(i)">my file</a></span>
                    </div>
                  </v-card-title>
                </v-card>
              </v-flex>
            </v-layout>
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
    name: 'editLegacy',
    data () {
      return {
        myName: '',
        myEmail: '',
        myEthAddress: '',
        newMessageErrors: '',
        emailErrors: '',
        ethAddressErrors: '',
        uploadedFiles: [],
        instance: {},
        isLoading: false,
        beneficiaries: [{
          ethAddress: "",
          beneficiaryMessage: "",
          file: {
              name: '',
              path: '',
          }
        }],
        feedbackMsg: '',
        ipfsHashs: [],
        ownerAddress: '',
        beneficiariesAddresses: [],
        beneficiariesMessages: [],
        addressRequested: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid'
        ],
        newMessageRules: [
          v => !!v || 'Message is required'
        ],        
        // newMessageRules: [
        //   v => !!v || 'Message is required'
        // ],        
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
      submit () {
        if (this.$refs.form.validate()) {
          console.log("New instance!")
          this.isLoading = true;
          ipfs.add(this.getMessagesToUploadFromBeneficiaries(this.beneficiaries), (err, ipfsHashs) => {
            if (err) {
              return console.log(err);
            }
            this.ipfsHashs = ipfsHashs;
            Legacy.createInstance(10, this.formatBenefiariesAddresses(this.beneficiaries),this.formatIpfsHashs(ipfsHashs)).then(instance => {
                console.log(instance)
                this.isLoading = false;
                this.instance = instance;
                this.feedbackMsg = "Your message has been successfully stored."

              }).catch(err => {
                console.log(err)
              })
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
            }
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
                let bytes = bs58.decode('QmTfCejgo2wTwqnDJs8Lu1pCNeCrCDuE4GAwkna93zdd7d');
        // first 2 bytes are hash function identifier and length
        let multiHashIdLen = 2;
        // remove the multihash hash id
        console.log('0x' + bytes.slice(multiHashIdLen, bytes.length).toString('hex'))
        console.log(bytes.slice(multiHashIdLen, bytes.length).toString('hex').length)
        // Legacy.getOwnerAddress().then(ownerAddress => {
        //   this.ownerAddress = ownerAddress
        //   console.log("Address is: " + ownerAddress)
        // })
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
        var beneficiariesMessages = [];
        for(var i=0; i < beneficiaries.length; i++ ){
          beneficiariesMessages.push({
            content: Buffer.from(beneficiaries[i].beneficiaryMessage)
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
          }
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
</style>
