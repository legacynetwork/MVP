<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm1 >
        <h2 class="display-2  mb-3">Legacy management</h2>
        <v-divider></v-divider>

        <!-- TODO: fix v-card -->
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
            type="warning"
            dismissible
            transition="scale-transition"
            >
            <p>{{errorMessage}}</p>
          </v-alert>
        </v-flex>
        <v-flex xs12 v-if="messageNotYourContract">
          <v-alert
            :value="true"
            type="warning"
            dismissible
            transition="scale-transition"
            >
            <p>{{messageNotYourContract}}</p>
          </v-alert>
        </v-flex>
      </v-flex>

      <v-flex xs12 sm10 offset-sm1 v-if="isDisplayChangePOL">

        <v-form ref="formPol">
          <h3 class="display-1 pl-4 mb-3">Update Contract settings</h3>
          <ContractParameterCard
            label="Time in days"
            headline="Proof of Life Timer"
            helperText="Update  the proof of life timer. <br>
              Tell us how long (in  days) you want this timer to be (eg. 30)."
            icon="timelapse"
            v-model="newTPol"
            :rules="tPolRules"
            inputType="inputNumber"
          />

          <v-flex text-xs-right class="mr-5">
            <v-btn
              @click="setPoLTime"
              color="accent"
              flat
              outline
              value="recent"
              class="warning"
            >
              Update
            </v-btn>
          </v-flex>
        </v-form>

        <v-flex xs12 v-if="messagePolUpdated">
          <v-alert
            :value="true"
            type="success"
            dismissible
            transition="scale-transition"
          >
            <p>{{messagePolUpdated}}</p>
          </v-alert>
        </v-flex>

        <v-flex d-flex xs12 class="mt-5">
          <v-card class="py-2 px-1">
            <v-card-text class="pb-0 pt-0">
              <v-layout align-center row wrap>
                <v-flex xs12 sm3>
                  <v-icon size="50">refresh</v-icon>
                </v-flex>
                <v-flex xs12 sm6 text-xs-center>
                    <p class="my-0">Show us that your are up and around!</p>
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
          </v-card>
        </v-flex>

        <v-flex xs12 v-if="messagePingUpdated">
          <v-alert
            :value="true"
            type="success"
            dismissible
            transition="scale-transition"
            >
            {{messagePingUpdated}}
          </v-alert>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import Legacy from '@/js/legacy'
  import ContractParameterCard from '@/components/ContractParameterCard'
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
        messageNotYourContract: '',
        isDisplayChangePOL: false,
        messageIsBeneficiary: '',
        beneficiaryCID: '',
        messagePingUpdated: "",
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
    components: {
      ContractParameterCard
    },
    methods: {
      submit: function () {
        this.messagePolUpdated = '';
        this.messagePingUpdated = '';
        this.messageNotYourContract = '';
        this.isDisplayChangePOL = false;
        if (this.$refs.form.validate()) {

        Legacy.getSmartContractInstance(this.smartContractAddress).then(instance => {
            this.instance = instance;
            // check if user is a beneficiary of this contract
            this.getOwnerAddress(instance.userAddress)
          }).catch(err => {
            console.log("Error submit : " + err)
          })
        }
      },
      ping: function() {
        Legacy.giveProofOfLife().
        then(() => {
          Legacy.getPoLTimerLen().then(tPol => {
            this.tPol = tPol/24/60/60;
            this.messagePingUpdated = 'The contract timer has been reset. ' +
              'Reset again before ' + this.tPol + ' days.';
          })
        })
      },
      getPoLTimerLen: function () {
          Legacy.getPoLTimerLen().then(tPol => {
          this.tPol = tPol/24/60/60;
          console.log("tPol is: " + tPol);
        })
      },
      isBeneficiary: function (userAddress) {
          Legacy.isBeneficiary(userAddress).then(isBeneficiary => {
          if(isBeneficiary){
            this.messageIsBeneficiary = '';
            this.getProofOfLife();
          }else{
            this.messageIsBeneficiary = "It seems that you are not a " +
             "beneficiary of this contract. Check your Metamask account";
          }
        })
      },
      getOwnerAddress: function (userAddress) {
          Legacy.getOwnerAddress().then(ownerAddress => {
          console.log("ownerAddress is: " + ownerAddress);
          if (ownerAddress == userAddress) {
            this.messageNotYourContract = '';
            this.isDisplayChangePOL = true;
          } else {
            this.isDisplayChangePOL = false;
            this.messageNotYourContract = "You are not the owner of this " +
             "smart contract";
          }
        })
      },
      setPoLTime: function () {
        if (this.$refs.formPol.validate()) {
          Legacy.setPoLTime(this.newTPol).then( () => {
            this.messagePolUpdated = "The timer length has been updated " +
              "successfully";
          });
        }
      },
    }
  }
</script>
