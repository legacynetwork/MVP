<template>
  <div class="editLegacy">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs10 offset-xs1>
          <form>
            <h2>Your personal informations</h2>
            <v-text-field
              v-model="myName"
              :error-messages="nameErrors"
              :counter="10"
              label="Your name"
              required
            ></v-text-field>
            <v-text-field
              v-model="myEmail"
              :error-messages="emailErrors"
              label="Your e-mail"
              required
            ></v-text-field>
            <v-text-field
              v-model="myEthAddress"
              :error-messages="ethAddressErrors"
              label="Your Ethereum address"
              required
            ></v-text-field>            

            <h2>Your files</h2>
            <v-flex  
              v-for="(row, index) in uploadedFiles"
              v-bind:key='index'
              >
              <v-layout align-center row wrap>
                <v-flex d-flex xs11 sm3>
                  <v-text-field v-model="row.title"
                                label="File name"
                  ></v-text-field>
                </v-flex>
                <v-flex d-flex xs11 sm3>
                  <v-text-field v-model="row.description"
                                label="description"
                  ></v-text-field>
                </v-flex>      
                <v-flex d-flex xs11 sm3>
                  <label class="fileContainer v-btn blue-grey white--text">
                      {{row.file.name}}
                    <input type="file" @change="setFilename($event, row)" :id="index"/>
                  </label>
                </v-flex>
                <!-- <v-avatar color="red red--after">
                  <a v-on:click="removeElement(index);" style="cursor: pointer"><v-icon dark>clear</v-icon></a>
                </v-avatar> -->
                  <v-btn
                    @click="removeElement(index);"
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
                @click="addRow"
                color="teal"
                flat
                value="recent"
                class="teal lighten-5"
              >
                <v-icon>add</v-icon>
                <span>Add file</span>
              </v-btn>
            </v-flex>

            <v-btn @click="submit" color="success">submit</v-btn>
            <v-btn @click="clear" color="warning">clear</v-btn>
          </form>
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
        uploadedFiles: []
      }
    },
    methods: {
      submit () {

      },
      clear () {
        this.myName = ''
        this.myEmail = ''
        this.myEthAddress = ''
        this.uploadedFiles = []
      },      
      addRow: function() {
        var elem = document.createElement('tr');
        this.uploadedFiles.push({
          title: "",
          description: "",
          file: {
              name: 'Choose File'
          }
        });
      },
      removeElement: function(index) {
        this.uploadedFiles.splice(index, 1);
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
