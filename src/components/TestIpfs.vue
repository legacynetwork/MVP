<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap text-md-center>
      <v-flex my-4>
        <h1>IPFS Integration Test</h1>
      </v-flex>      
    </v-layout>    
    <v-layout row align-center>    
      <v-flex text-md-right sm5>        
        <v-btn @click.native="getBeneficiary">Get beneficiary by index:</v-btn>
      </v-flex>
      <v-flex sm1>
        <v-text-field label="index" v-model="benefIndex"></v-text-field>
      </v-flex>    
      <v-flex sm6>
        {{benefAddress}}
      </v-flex>
    </v-layout>
    <v-layout row align-center>    
      <v-flex d-flex sm5 offset-sm1 text-md-right>
        <v-text-field v-model="myMessage" label="Write your message here..."></v-text-field>
      </v-flex>
      <v-flex sm6>        
      </v-flex>
    </v-layout>
    <v-layout row align-center>    
      <v-flex d-flex sm5 offset-sm1 text-md-right>
        <v-text-field v-model="inputAddress" label="Write your beneficiary address here..."></v-text-field>
      </v-flex>
      <v-flex sm6>
        <v-btn @click="submit" color="success">submit</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row align-center>
    <!-- <v-layout align-center row text-md-center> -->
      <v-flex d-flex sm5 offset-sm1 text-md-right>
        <p>{{feedbackMg}}</p>
      </v-flex>
      <v-flex sm6>
        <p>{{ipfsHash}}</p>
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
        benefAddress: 0x0000000000000000000000000000000000000000,
        benefIndex: '',
        myMessage: "",
        inputAddress: "",
        feedbackMg: "",
        ipfsHash: ""  
      }
    },
    beforeCreate: function () {
      Legacy.init().catch(err => {
        console.log(err)
      })      
    },
    created: function () {      
    },
    methods: {  
      getBeneficiary: function () {
        console.log(this.benefIndex);
        Legacy.getBeneficiary(parseInt(this.benefIndex, 10)).then( benef => {
          this.benefAddress = benef;
        })
        .catch(err => {
          console.log(err)
        })
      },
      submit: function () {
        ipfs.add(Buffer.from(this.myMessage), (err, hash) => {
          if (err) {
            return console.log(err);
          }
          console.log("IPFS hash:", hash);
          this.ipfsHash = hash[0].path;
          this.feedbackMg = "Your message has been successfully stored."
          let bytesMessAdd = util.ipfsHashToBytes(this.ipfsHash)
          let adds = [this.inputAddress]
          let messAdds = [bytesMessAdd]
          console.log('Beneficiary address: ' + adds[0])
          console.log('Message IPFS address: ' + messAdds[0])
          Legacy.addBeneficiaries(adds, messAdds)        
            .catch(err => {
              console.log(err)
            })
          this.myMessage = ''
          this.inputAddress = ''
        });
          
        // to test addBeneficiaries (no ipfs storing):
        // let ipfsHash = 'QmWmyoMoctfbAaiEs2G46gpeUmhqFRDW6KWo64y5r581Vz'
        // let bytesMessAdd = util.ipfsHashToBytes(ipfsHash)
        // let adds = [this.inputAddress]
        // let messAdds = [bytesMessAdd]
        // console.log(adds)
        // console.log(messAdds)
        // Legacy.addBeneficiaries(adds, messAdds)
        //   .catch(err => {
        //     console.log(err)
        //   })
        // this.myMessage = ''
        // this.inputAddress = ''

      }      
    }
  }
</script>