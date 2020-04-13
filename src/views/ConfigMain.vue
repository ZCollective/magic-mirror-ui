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
        <v-row align="start" justify="center">
          <v-btn v-if="!updateAvailable"
            @click="checkForUpdate"
            :loading="updateBusy">Check for Updates</v-btn>
            <v-btn v-else @click="updateNow" :loading="updateInProgressBusy">
              Update Now!
            </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import configService from '@/services/configService'
const eventbus = require('../eventbus')
const sendEvents = require('../../lib/mirror_shared_code/socketEvents')

export default {
  name: "ConfigMain",
  data: () => ({
    testResult: 'No Test has been run!',
    updateAvailable: false,
    updateBusy: false,
    updateSuccessful: false,
    updateInProgressBusy: false
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
    async checkForUpdate() {
      const timeoutHandle = setTimeout(() => {
        this.updateBusy = false
        eventbus.emit('snackbar', 'Could not check for updates!')
      }, 5000)
      eventbus.on(sendEvents.config_frontend.signal_is_update_available.responses.update_available, () => {
        console.log('Update is available')
        clearTimeout(timeoutHandle)
        this.updateAvailable = true
        this.updateBusy = false
      })
      eventbus.on(sendEvents.config_frontend.signal_is_update_available.responses.no_update_available, () => {
        console.log('Update is not available')
        clearTimeout(timeoutHandle)
        this.updateBusy = false
        eventbus.emit('snackbar', 'No Update Available!')
      })

      // Sending the scan request to backend
      console.log('sending update check request to backend.')
      this.updateBusy = true
      this.$socket.sendObj({ event: sendEvents.config_frontend.signal_is_update_available.event })
    },
    async updateNow() {
      this.updateInProgressBusy = true

      eventbus.on(sendEvents.config_frontend.signal_update_now.responses.update_successful, () => {
        console.log('Update success!')
        this.updateAvailable = false
        this.updateInProgressBusy = false
        this.updateSuccessful = true
        eventbus.emit('snackbar', 'Update successful!')
      })

      eventbus.on(sendEvents.config_frontend.signal_update_now.responses.update_failed, () => {
        console.log('Update failed!')
        this.updateAvailable = true
        this.updateInProgressBusy = false
        eventbus.emit('snackbar', 'Update failed!')
      })
      // Sending the scan request to backend
      console.log('sending update check request to backend.')
      this.$socket.sendObj({ event: sendEvents.config_frontend.signal_update_now.event })
    }
  }
};
</script>
