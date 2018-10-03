<template>
  <div class="editLegacy">
    <h1>{{ msg }} {{ownerAddress}}</h1>

            <v-flex d-flex xs11 sm4 offset-xs1>
          <v-btn @click.native="start">Start</v-btn>
        </v-flex>


            <v-flex d-flex xs11 sm4 offset-xs1>
          <v-btn @click.native="getOwnerAddress">Get owner address</v-btn>
        </v-flex>
        <v-flex xs3 sm6 text-xs-left offset-xs1>
          <div>
            Owner address : {{ownerAddress}}
          </div>
        </v-flex>
  </div>
</template>

<script>
  import Legacy from '@/js/legacy'

  export default {
    name: 'editLegacy',
    data () {
      return {
        ownerAddress: 0x0000000000000000000000000000000000000000,
        msg: 'Welcome to the creation legacy page Mr: '
      }
    },
    beforeCreate: function () {
      Legacy.init().catch(err => {
        console.log(err)
      })
    },    
    methods: {
      getOwnerAddress: function () {
        Legacy.getOwnerAddress().then(ownerAddress => {
          this.ownerAddress = ownerAddress
        })
      },
      start: function () {
        Legacy.start()
      }      
    }
  }
</script>