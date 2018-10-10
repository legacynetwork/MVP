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
              v-for="(row, i) in beneficiarieAddresses"
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
        beneficiarieAddresses: [],
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
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
        }
      },
      clear () {
        this.$refs.form.reset()
      },      
      addEthAddress: function() {
        this.beneficiarieAddresses.push({
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
        this.beneficiarieAddresses.splice(index, 1);
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
