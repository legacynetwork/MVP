<template>
  <div class="editLegacy">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs10 offset-xs1>
          <v-form ref="form">
            <h2>Your personal informations</h2>
            <v-text-field
              v-model="myName"
              :error-messages="nameErrors"
              label="Your name"
              required
            ></v-text-field>
            <v-text-field
              v-model="myEmail"
              :error-messages="emailErrors"
              :rules="emailRules"
              label="Your e-mail"
              required
            ></v-text-field>
            <v-text-field
              v-model="myEthAddress"
              :error-messages="ethAddressErrors"
              :counter="42"
              :rules="ethAddressRules"
              label="Your Ethereum address"
              required
            ></v-text-field>            

            <h2>Your beneficiaries</h2>
            <v-flex  
              v-for="(row, i) in beneficiaries"
              :key="`A-${i}`"
              >
              <v-layout align-center row wrap>
                <v-flex d-flex xs11 sm5>
                  <v-text-field v-model="row.ethAddress"
                                label="Beneficiary address"
                                :error-messages="ethAddressErrors"
                                :counter="42"
                                :rules="ethAddressRules"                                
                  ></v-text-field>
                </v-flex>
                <v-flex d-flex xs11 sm6>
                  <v-text-field v-model="row.beneficiaryMessage"
                                label="Beneficiary message"
                  ></v-text-field>
                </v-flex>                
                <v-btn
                    @click="removeEthAddress(`A-${i}`);"
                    color="red"
                    flat
                    value="recent"
                    class="red lighten-5"
                  >
                    <v-icon>clear</v-icon>
                  </v-btn>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-btn
                @click="addEthAddress"
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
        </v-flex>

        <v-flex d-flex xs11 sm4 offset-xs1>
          <v-btn @click.native="getOwnerAddress">Get owner address</v-btn>
        </v-flex>
        <v-flex xs3 sm6 text-xs-left offset-xs1>
          <div>
            Owner address : {{ownerAddress}}
          </div>
        </v-flex>

         <v-flex d-flex xs11 sm4 offset-xs1>
          <v-layout row wrap>
            <v-flex xs12 sm4>
              <v-text-field
                label="ETH Address"
                single-line
                v-model="addressRequested"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex d-flex xs11 sm4 offset-xs1>
          <v-btn @click.native="getBenefiaciesMessage">getBenefiaciesMessage</v-btn>
        </v-flex>
        <v-flex xs3 sm6 text-xs-left offset-xs1>
          <div>
            Benefiacies CID : {{beneficiariesMessages}}
          </div>
        </v-flex>

        <v-flex d-flex xs11 sm4 offset-xs1>
          <v-btn @click.native="getBenefiaciesAddresses">getBenefiaciesAddresses</v-btn>
        </v-flex>
        <v-flex xs3 sm6 text-xs-left offset-xs1>
          <div>
            Beneficiaries Addresses : {{beneficiariesAddresses}}
          </div>
        </v-flex>                

        <v-flex d-flex xs11 sm4 offset-xs1>
          <v-btn @click.native="deploy">Deploy</v-btn>
        </v-flex>  

        <v-flex d-flex xs11 sm4 offset-xs1>
          <v-btn @click.native="newInstance">newInstance</v-btn>
        </v-flex>    

      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import Legacy from '@/js/legacy'

   export default {
    name: 'editLegacy',
    data () {
      return {
        myName: '',
        myEmail: '',
        myEthAddress: '',
        nameErrors: '',
        emailErrors: '',
        ethAddressErrors: '',
        uploadedFiles: [],
        beneficiaries: [],
        ownerAddress: '',
        beneficiariesAddresses: [],
        beneficiariesMessages: [],
        addressRequested: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid'
        ],
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
        }
      },
      clear () {
        this.$refs.form.reset()
      },    
      newInstance: function () {
        console.log("New instance!")
        Legacy.createInstance(10, this.formatBenefiariesAddresses(this.beneficiaries),this.formatBenefiariesMessages(this.beneficiaries)).then(instance => {
            console.log(instance)
          }).catch(err => {
            console.log(err)
          })
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
        console.log("Get Owner address!")
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
      getBenefiaciesMessage: function () {
        console.log("Get Owner address!")
        Legacy.getBenefiaciesMessage(this.addressRequested).then(beneficiariesMessages => {
          this.beneficiariesMessages = beneficiariesMessages
          console.log("Address is: " + beneficiariesMessages)
        })
      },              
      formatBenefiariesAddresses: function(beneficiaries) {
        var beneficiariesAddress = [];
        for(var i=0; i < beneficiaries.length; i++ ){
          beneficiariesAddress.push(beneficiaries[i].ethAddress);
        }
        return beneficiariesAddress;
      },
      formatBenefiariesMessages: function(beneficiaries) {
        var beneficiariesCIDs = '';
        for(var i=0; i < beneficiaries.length; i++ ){
          beneficiariesCIDs = beneficiariesCIDs + beneficiaries[i].beneficiaryMessage + ';'
        }
        console.log("CIDs : " + beneficiariesCIDs);
        return beneficiariesCIDs;
      },      
      addEthAddress: function() {
        this.beneficiaries.push({
          ethAddress: "",
          file: {
              name: 'ETH address'
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
      },      
      setFilename: function(event, row) {
        var file = event.target.files[0];
        row.file = file
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
