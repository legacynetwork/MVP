<template>
  <v-container grid-list-md fluid>
    
    <v-layout row wrap text-md-center my-4>
      <v-flex>
        <h1>IPFS Integration Test</h1>
      </v-flex>      
    </v-layout>
    
    <v-layout row wrap >
      <v-flex text-md-left sm12 xs12>
        <h2>1. Upload a message</h2>
        <p>This test stores a new beneficiary in the contract using the method addBeneficiary. Once the message is successfully
          stored, you can retreive it in gateway.ipfs.io/ipfs/&#60ipfs_hash&#62.</p>
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

    <v-divider></v-divider>

    <v-layout row wrap my-4>
      <v-flex text-md-left sm12 xs12>
        <h2>2. Retrieve Message from IPFS</h2>
        <p>Retrieve the message associated to the beneficiary address, by reading the IPFS address stored in the contract.</p>
      </v-flex>
    </v-layout>
    <v-layout row align-center>
      <v-flex d-flex sm5 offset-sm1 text-md-right>
        <v-text-field v-model="messageOwnerAdds" label="Message owner address..."></v-text-field>
      </v-flex>
      <v-flex sm6>
        <v-btn @click="fetchMessage" color="success">fetch message</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row align-center>
      <v-flex d-flex sm5 offset-sm1 text-md-right>
        <p>Retrieved message content: {{retrievedMessage}}</p>
      </v-flex>      
    </v-layout>

    <v-divider></v-divider>

    <v-layout row wrap my-4>
      <v-flex text-md-left sm12 xs12>
        <h2>3. Delete a Message from IPFS</h2>
        <p></p>
      </v-flex>
    </v-layout>
    <v-layout row align-center>    
      <v-flex d-flex sm5 offset-sm1 text-md-right>
        <v-text-field v-model="messAddressToDelete" label="Message IPFS Address..."></v-text-field>
      </v-flex>
      <v-flex sm6>
        <v-btn @click="deleteMessage" color="success">delete message</v-btn>
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
        benefAddress: "",
        benefIndex: "",
        myMessage: "",
        inputAddress: "",
        feedbackMg: "",
        ipfsHash: "",
        messageOwnerAdds: "0x5c14960638542fbf9714f2ae3224b432ef0de099",
        retrievedMessage: "",
        messAddressToDelete: "",
      }
    },
    beforeCreate: function () {
      Legacy.init().catch(err => {
        console.log(err)
      })      
    },      
    methods: {  
      getBeneficiary: function () {        
        Legacy.getBeneficiary(parseInt(this.benefIndex, 10)).then( benef => {
          this.benefAddress = benef;
        })
        .catch(err => {
          this.benefAddress = "Could not find a beneficiary for this index."
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
          this.messageOwnerAdds = this.inputAddress
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

      },
      fetchMessage: function() {
        // THIS WORKS:
        // ipfs.files.cat('QmcJpgq7dTqtgem6RdpHDkGmwb7RiQ6GdoAUDp1ZChZ6Yp').then(fileBuffer => {
        //   console.log(fileBuffer.toString())
        // })
        // .catch(err => {
        //   console.log(err)
        // })

        // THIS DOESN'T:
        Legacy.getMessageAddress(this.messageOwnerAdds).then( messAdds => {
          let ipfsHash = util.bytesToIpfsHash(messAdds)
          console.log(ipfsHash)
                  
          // with cat
          ipfs.files.cat(ipfsHash, (err, fileBuffer) => {
            console.log(fileBuffer.toString())
            if (err) {
              console.log(err)
            }
          })

        })       
      },
      deleteMessage: function() {

      }
    }
  }
</script>