<template>
  <div>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm10 offset-sm1 >
          <h2 class="display-2  mb-3">Legacy management</h2>
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
            <v-flex xs12 v-if="messageNotYourContract">
              <v-alert
                v-model="alertNotYourContract"
                type="warning"
                dismissible
                transition="scale-transition"
                >
                <p>{{messageNotYourContract}}</p>
              </v-alert>
            </v-flex>

            <v-form ref="formPol" v-if="isDisplayChangePOL">
              <div class="backgroundPrimaryCardColor mt-5">
                <v-card-title class="text-sm-left" primary-title >
                  <h3 class="display-1 pl-4 mb-3">Contract settings</h3>
                  <v-card-text class="pb-0 pt-0">
                    <v-flex d-flex xs12>
                      <v-card class="backgroundSecondaryCardColor">
                        <v-card-title class="text-sm-left" primary-title>
                          <span class="headline">Update Proof of Life Timer</span><br>
                          <v-card-text class="pb-0 pt-0">
                            <v-layout align-center row wrap>
                              <v-flex d-flex xs12 sm1>
                                <v-icon size="50">timelapse</v-icon>
                              </v-flex>
                              <v-flex d-flex xs12 sm8>
                              <p> Update  the proof of life timer. <br>
                                Tell us how long (in  days) you want this timer to be (eg. 30).</p>
                              </v-flex>
                              <v-flex d-flex xs12 sm3>
                                <v-text-field
                                  v-model="newTPol"
                                  outline
                                  height="100"
                                  label="Time in days"
                                  :error-messages="tPolErrors"
                                  :rules="tPolRules"
                                  dark
                                  class="inputNumber"
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
              <v-flex text-xs-right class="mr-5">
                <v-btn
                  @click="setPoLTime"
                  color="accent"
                  flat
                  outline
                  value="recent"
                  class="warning"
                >
                  Update PoL time
                </v-btn>
              </v-flex>
            </v-form>

            <v-flex xs12 v-if="messagePolUpdated">
              <v-alert
                v-model="alertTpolUplated"
                type="success"
                dismissible
                transition="scale-transition"
                >
                <p>{{messagePolUpdated}}</p>
              </v-alert>
            </v-flex>

            <v-flex d-flex xs12 v-if="isDisplayChangePOL">
              <div class="backgroundPrimaryCardColor mt-5">
                <v-card-title class="text-sm-left" primary-title >
                  <v-flex d-flex xs12>
                      <v-card class="">
                        <v-card-title class="text-sm-left" primary-title>
                          <!-- <span class="headline">PING !</span><br> -->
                          <v-card-text class="pb-0 pt-0">
                            <v-layout align-center row wrap>
                              <v-flex xs12 sm3>
                                <v-icon size="50">refresh</v-icon>
                              </v-flex>
                              <v-flex xs12 sm6 text-xs-center>
                                <p style="font-size: x-large;"> PING !</p>
                              </v-flex>
                              <v-flex xs12 text-xs-right sm3>
                                <v-btn
                                  color="grey"
                                  flat
                                  value="recent"
                                  class="warning"
                                  large @click.native="ping"
                                  >
                                  I'm alive
                                </v-btn>
                              </v-flex>
                            </v-layout>
                          </v-card-text>
                        </v-card-title>
                      </v-card>
                    </v-flex>
                </v-card-title>
              </div>
            </v-flex>
            <v-flex xs12 v-if="messagePingUpdated">
              <v-alert
                type="success"
                v-model="alertPing"
                dismissible
                transition="scale-transition"
                >
                <p>{{messagePingUpdated}}</p>
              </v-alert>
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
        instance: '',
        tPol: '',
        newTPol: '',
        smartContractAddress: '',
        ethAddressErrors: '',
        errorMessage: '',
        tPolErrors: '',
        messageNotYourContract: '',
        isDisplayChangePOL: false,
        alertPing: true,
        alertNotYourContract: true,
        alertTpolUplated: true,
        messageIsBeneficiary: '',
        beneficiariesCID: '',
        messagePingUpdated: "",
        time: '',
        tZero: '',
        messagePolUpdated: '',
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
        this.messagePolUpdated = '';
        this.messagePingUpdated = '';
        this.messageNotYourContract = '';
        this.isDisplayChangePOL = false;
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
        Legacy.getPoLTimerLen().then(tPol => {
          this.tPol = tPol/24/60/60
          this.messagePingUpdated = 'Smart contract renewed. Re-ping before ' + this.tPol + ' days.';
          this.alertPing = true;
        })
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
          Legacy.getOwnerAddress().then(ownerAddress => {
          console.log("ownerAddress is: " + ownerAddress);
          if(ownerAddress == userAddress){
            this.messageNotYourContract = '';
            this.isDisplayChangePOL = true;
            this.alertNotYourContract = true;
          }else{
            this.isDisplayChangePOL = false;
            this.messageNotYourContract = "You are not the owner of this smart contract";
          }
        })
      },
      setPoLTime: function (){
        if (this.$refs.formPol.validate()) {
          Legacy.setPoLTime(this.newTPol).then(
            this.messagePolUpdated = "The PoL time has succeesfully been updated"
          ).then(
            this.alertTpolUplated = true
            )
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
