<template>
  <v-container grid-list-md>
    <h1 class="display-1 primary--text">Beneficiary management</h1>
    <v-layout row wrap>
        <v-flex d-flex xs12>
          <v-form ref="form">
            <v-card >
              <v-card-title class="text-sm-left" primary-title>
                <span class="headline">Your contract information</span><br>
                <v-card-text class="pb-0 pt-0">
                  <v-layout align-center row wrap>
                    <v-flex d-flex xs12>
                      Enter informations about your contract
                    </v-flex>  
                    <v-flex d-flex xs12>
                      <v-text-field v-model="smartContractAddress"
                                    label="Smart contract address (0x...)"
                                    :error-messages="ethAddressErrors"
                                    :counter="42"
                                    :rules="ethAddressRules"    
                      ></v-text-field>
                    </v-flex>  
                  </v-layout>
                </v-card-text>
              </v-card-title>
              <v-card-actions class="pt-0">
                  <v-btn 
                    @click="submit"
                    color="success"
                    value="recent"
                  >
                    Search
                  </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 v-if="errorMessage">
          <v-card color="error" class="white--text">
            <v-card-title class="text-sm-left" primary-title>
              <div>
                <span class="headline">{{errorMessage}}</span><br>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>   
        <v-flex xs12 v-if="messageTestatorAlive">
          <v-card color="success" class="white--text">
            <v-card-title class="text-sm-left" primary-title>
              <div>
                <span class="headline">{{messageTestatorAlive}}</span><br>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>           
        <v-flex xs12 v-if="messageIsBeneficiary">
          <v-card color="success" class="white--text">
            <v-card-title class="text-sm-left" primary-title>
              <div>
                <span class="headline">{{messageIsBeneficiary}}</span><br>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>               

        <v-flex xs12 v-if="beneficiariesCID">
          <v-card >
            <v-card-title class="text-sm-left" primary-title>
              <div>
                <span class="headline">Your file</span><br>
                <span>Files link: <a v-bind:href="generateInfuraUrl()">my file</a></span>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- <v-flex d-flex xs11 sm4 offset-xs1>
      <v-btn @click.native="getSmartContractInstance">Get instance</v-btn>
    </v-flex>

    <v-flex d-flex xs11 sm4 offset-xs1>
      <v-btn @click.native="getPoLTimerLen">Get tPol</v-btn>
    </v-flex>
    <v-flex xs3 sm6 text-xs-left offset-xs1>
      <div>
        tPol : {{tPol}}
      </div>
    </v-flex>

    <v-flex d-flex xs11 sm4 offset-xs1>
      <v-btn @click.native="getTZero">Get tZero</v-btn>
    </v-flex>
    <v-flex xs3 sm6 text-xs-left offset-xs1>
      <div>
        tZero : {{tZero}}
      </div>
    </v-flex>    

    <v-flex d-flex xs11 sm4 offset-xs1>
      <v-btn @click.native="getTime">Get time</v-btn>
    </v-flex>
    <v-flex xs3 sm6 text-xs-left offset-xs1>
      <div>
        time : {{time}}
      </div>
    </v-flex> -->

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
          if(instance)
            console.log("Get instance from vue :" + instance);
            this.instance = instance;
            // check if user is the heir is part of the contract
            this.isBeneficiary(instance.userAddress)
          }).catch(err => {
            console.log("Error submit : " + err)
          })
        }
      },
      getPoLTimerLen: function () {
          Legacy.getPoLTimerLen().then(tPol => {
          this.tPol = tPol/24/60/60
          console.log("tPol is: " + tPol)
        })
      },
      isBeneficiary: function (userAddress) {
          Legacy.isBeneficiary(userAddress).then(isBeneficiary => {
          if(isBeneficiary){
            this.messageIsBeneficiary = '';
            this.getProofOfLife()
          }else{
            this.messageIsBeneficiary = "You are not a heir of this contract";
          }
        })
      },      
      getProofOfLife: function () {
          Legacy.getProofOfLife().then(isAlive => {
          console.log("isAlive is: " + isAlive);
          if(!isAlive){
            this.messageTestatorAlive = '';
            this.getBenefiaciesCID();
          }else{
            this.messageTestatorAlive = "Your testator is still alive. You can't get your legacy";
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
