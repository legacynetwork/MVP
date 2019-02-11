<template>
  <v-card class="backgroundSecondaryCardColor mb-3 pt-2 px-1">
    <v-flex d-flex xs12>
      <v-layout align-center row wrap>
        <v-flex d-flex xs12 sm2>
          <v-card-title class="text-sm-left" primary-title>
            <span class="headline">{{headline}}</span><br>
          </v-card-title>
        </v-flex>
        <v-flex d-flex xs12 sm8>
          <v-icon size="50" class="mr-3">{{icon}}</v-icon>
          <v-card-text class="pb-0 pt-0">
            <p v-html="helperText"></p>
          </v-card-text>
        </v-flex>
        <v-flex d-flex xs12 sm2>
          <v-text-field
            outline
            height="100"
            :label="label"
            dark
            v-bind:value="value"
            v-on:input="$emit('input', $event)"
            :rules="rules"
            :class="inputType"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-card>
</template>

<script>
  export default {
    props: {
      label: String,
      headline: String,
      icon: String,
      helperText: String,
      value: String,
      inputType: String,
      rules: Array,
    },
  }
</script>

<style>
.v-input.inputNumber input{
  font-size:50px;
  max-height: 100px;
}
</style>
