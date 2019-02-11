<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm1 >
        <h2 class="display-2  mb-3">Secret Keeper?</h2>
        <h3 class="mb-3">
          If you are a secret keeper of a Legacy contract and the contract
          owner has passed away, you will be able to enter your secret share
          once the proof-of-life timer expirates.
        </h3>
        <v-divider></v-divider>

        <v-form ref="form">
          <v-card class="backgroundPrimaryCardColor">
            <v-card-title class="text-sm-left pb-0" primary-title>
              <h3 class="display-1 pl-4 mb-3">Lecagy contract Address</h3>
            </v-card-title>
            <v-card-text class="pb-0 pt-0">
              <v-layout align-center row wrap>
                <v-flex d-flex xs12>
                  <v-text-field
                    v-model="contractAddress"
                    label="Type or paste here the smart contract address (0x...)"
                    :counter="42"
                    :rules="ethAddressRules"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          <v-flex text-xs-right class="my-4">
            <v-btn
              @click="submit"
              color="grey"
              flat
              class="warning"
            >
              Search
            </v-btn>
          </v-flex>
        </v-form>

      </v-flex>

      <!-- issues message section -->
      <v-flex xs12 sm10 offset-sm1 >
        <v-flex xs12 v-if="errorMessage">
          <v-alert
            :value="true"
            type="warning"
            dismissible
            transition="scale-transition"
          >
            {{errorMessage}}
          </v-alert>
        </v-flex>
        <v-flex xs12 v-if="contractFound">
          <v-alert
            :value="true"
            type="success"
            dismissible
            transition="scale-transition"
          >
            Contract found.
          </v-alert>
        </v-flex>

        <v-flex xs12
          v-if="issues"
          v-for="(msg, i) in issues"
          :key="`m-${i}`"
        >
          <v-alert
            :value="true"
            type="warning"
            dismissible
            transition="scale-transition"
          >
            {{msg}}
          </v-alert>
        </v-flex>
      </v-flex>

      <!-- save secret form -->
      <v-flex xs12 sm10 offset-sm1 >
        <v-form ref="formSecret" v-if="displayForm">
          <h3 class="display-1 pl-4 mb-3 mt-5">Save your Secret Share</h3>
          <v-card class="backgroundSecondaryCardColor mb-3">
            <v-card-text class="pb-0 pt-0">
              <v-layout align-center row wrap>
                <v-flex xs12 sm1>
                  <v-icon size="50">vpn_key</v-icon>
                </v-flex>
                <v-flex d-flex xs12 sm4>
                  <v-text-field
                    v-model="secretShare"
                    label="Type here your secret share"
                    dark
                    :rules="secretRules"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>

          <v-flex text-xs-right class="my-4">
            <v-btn
              @click="saveSecretShare"
              color="grey"
              flat
              class="warning"
            >
              Submit
            </v-btn>
          </v-flex>
        </v-form>

        <v-flex xs12 v-if="secretSaved">
          <v-alert
            :value="true"
            type="success"
            dismissible
            transition="scale-transition"
            >
            {{feedbackMsg}}
          </v-alert>
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
        contractAddress: '',
        contractFound: false,
        errorMessage: '',
        isAlive: true,
        displayForm: false,
        issues: [],
        secretShare: '',
        secretSaved: false,
        feedbackMsg: '',
        ethAddressRules: [
          v => !!v || 'ETH address is required',
          v => /^(0x){1}[0-9a-fA-F]{40}$/i.test(v) || 'ETH address must be valid'
        ],
        secretRules: [
          v => !!v || 'This field is required'
        ]
      }
    },
    created: function () {
      Legacy.init();
    },

    methods: {
      submit: function () {
        if (this.$refs.form.validate()) {
          Legacy.getSmartContractInstance(this.contractAddress)
          .then(instance => {
            console.log("Contract retrieved.");
            console.log("User address: " + instance.userAddress);
            this.instance = instance;
            this.contractFound = true;
            this.isKeeper(instance.userAddress);
          })
          .catch(err => {
            console.log("Error submit : " + err);
            this.errorMessage = "Couldn't find contract at address" + this.contractAddress;
            this.contractFound = false;
            this.issues = [];
          })
        }
      },
      isKeeper: function (userAddress) {
        Legacy.isKeeper(userAddress).then(isKeeper => {
          if (isKeeper) {
            this.issues = [];
            this.getPoLInfo();
          } else {
            this.issues.push("It seems that you are not a secret keeper of this contract");
          }
        }).catch(err => {console.log("Error: " + err)});
      },
      getPoLInfo: function () {
        Legacy.getProofOfLife().then(isAlive => {
          if (isAlive) {
            this.isAlive = true;
            this.issues.push("This contract is still locked. Keepers can't save their secret shares yet.");
          } else {
            this.isAlive = false;
            this.displayForm = true;
          }
        })
        .catch(err => {console.log("Error: " + err)});
      },
      saveSecretShare: function () {
        this.errorMessage = '';
        if (this.$refs.formSecret.validate()) {
          let user = this.instance.userAddress;
          this.instance.keeperData.call(user).then( keeperData => {
            if(keeperData[1] == web3.sha3(this.secretShare)) {
              Legacy.saveSecretShare(this.instance.userAddress,this.secretShare)
              .then( () => {
                this.secretSaved = true;
                this.feedbackMsg = "Your secret share has been saved in the contract";
              })
              .catch(err => {console.log("Error: " + err)});
            } else {
              this.errorMessage = "The secret share is not valid.";
            }
          });
        }
      }
    }
  }
</script>
