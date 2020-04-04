<template>
  <v-container fluid style="height: 100%">
    <v-row justify="center">
      <v-col>
        <v-row align="start" justify="center">
          <div class="title">Welcome to the config options.</div>
        </v-row>
        <v-row align="center" justify="center" class="mt-5">
          <v-btn @click="testConnection">Test Backend Connection!</v-btn>
        </v-row>
        <v-row align="center" justify="center" class="mt-5">
          <div class="large">
            {{ testResult }}
          </div>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import configService from '@/services/configService'
const eventbus = require('../eventbus')
//const sendEvents = require('../../lib/mirror_shared_code/socketEvents').frontendEvents
//const receiveEvents = require('../../lib/mirror_shared_code/socketEvents').backendEvents


export default {
  name: "ConfigMain",
  data: () => ({
    testResult: 'No Test has been run!'
  }),
  created() {
    eventbus.emit('stopload')
  },
  methods: {
    async testConnection () {
      try {
        let response = await configService.testConnection()
        console.log(response)
        this.testResult = 'Success!'
      } catch (error) {
        this.testResult = 'Failed because of ' + error        
      }
    },
  }
};
</script>
