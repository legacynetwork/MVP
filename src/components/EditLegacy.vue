<template>
<div>
  <v-container grid-list-md>
    <h1 class="display-1 primary--text">Legacy management</h1>
    <v-layout row wrap>
        <v-flex d-flex xs12>
          <v-form ref="form">
            <v-card >
              <v-card-title class="text-sm-left" primary-title>
                <span class="headline">Your contract information</span><br>
                <v-card-text class="pb-0 pt-0">
                  <v-layout align-center row wrap>
                    <v-flex d-flex xs12>
                      Enter informations about your smart contract
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
        <v-flex xs12 v-if="messageNotYourContract">
          <v-card color="success" class="white--text">
            <v-card-title class="text-sm-left" primary-title>
              <div>
                <span class="headline">{{messageNotYourContract}}</span><br>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>           

        <v-form ref="form">
          <v-flex d-flex xs12 v-if="isDisplayChangePOL">
            <v-card >
              <v-card-title class="text-sm-left" primary-title>
                <span class="headline">Proof of life time</span><br>
                <v-card-text class="pb-0 pt-0">
                  <v-layout align-center row wrap>
                    <v-flex d-flex xs12 sm9>
                      Provide proof of life time. This time is used to set the longest period of inactivity before you declare yourself dead
                    </v-flex>  
                    <v-flex d-flex xs12 sm3>
                      <v-text-field v-model="newTPol"
                                    label="Time in days"
                                    :error-messages="tPolErrors"
                                    :rules="tPolRules"  
                      ></v-text-field>
                    </v-flex>  
                    <v-flex d-flex xs12 sm3 >
                      <v-btn @click.native="setPoLTime" color="success">Change PoL time</v-btn>
                    </v-flex> 
                  </v-layout>
                </v-card-text>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-form>

        <v-flex d-flex xs12 v-if="isDisplayChangePOL">
          <v-card >
            <v-card-title class="text-sm-left" primary-title>
              <span class="headline">Ping</span><br>
              <v-card-text class="pb-0 pt-0">
                <v-layout align-center row wrap>
                  <v-flex d-flex xs12 sm9>
                    Click on the button to provide your proof of life
                  </v-flex>  
                  <v-flex d-flex xs12 sm3>
                    <v-btn @click.native="ping" color="success">I'm alive</v-btn>
                  </v-flex>  
                </v-layout>
              </v-card-text>
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

</div>
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
        newTPol: '',
        smartContractAddress: '',
        ethAddressErrors: '',
        errorMessage: '',
        tPolErrors: '',
        messageNotYourContract: '',
        isDisplayChangePOL: false,
        messageIsBeneficiary: '',
        beneficiariesCID: '',
        time: '',
        tZero: '',
        ethAddressRules: [
          v => !!v || 'ETH address is required',
          v => /^(0x){1}[0-9a-fA-F]{40}$/i.test(v) || 'ETH address must be valid'
        ],
        tPolRules: [
          v => !!v || 'tPol is required',
          v => /^[0-9]+$/.test(v) || 'A number is required'
        ],           
      }
    },
    created: function () {
      Legacy.init();
    },    

  methods: {  
      submit: function () {
        if (this.$refs.form.validate()) {

        Legacy.getSmartContractInstance(this.smartContractAddress).then(instance => {
            console.log("Get instance from vue :" + instance);
            this.instance = instance;
            // check if user is the heir is part of the contract
            this.getOwnerAddress(instance.userAddress)
          }).catch(err => {
            console.log("Error submit : " + err)
          })
        }
      },
      ping: function(){
        Legacy.giveProofOfLife();
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
      getOwnerAddress: function (userAddress) {
          console.log("enter get owner");

          Legacy.getOwnerAddress().then(ownerAddress => {
          console.log("ownerAddress is: " + ownerAddress);
          if(ownerAddress == userAddress){
            this.messageNotYourContract = '';
            this.isDisplayChangePOL = true;
          }else{
            this.isDisplayChangePOL = false;
            this.messageNotYourContract = "You are not the owner of this smart contract";
          }
        })
      },
      setPoLTime: function (){
        if (this.$refs.form.validate()) {
          Legacy.setPoLTime(this.newTPol);
        }
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
