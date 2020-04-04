<template>
  <v-col v-if="!confirmed">
    <v-row align="center" justify="center" class="mb-8">
      <v-btn
        :disabled="currentNetwork === ''"
        @click="confirmSettings">
        Confirm Wifi Settings
      </v-btn>
    </v-row>
    <v-row align="center" justify="center">
      <v-btn 
        @click="scan"
        :loading="scanInProgress"
      >
        {{ scanHappened ? 'Rescan for Networks' : 'Scan for Networks'}}
      </v-btn>
    </v-row>
    <!-- Button & List for the available networks. -->
    <v-row align="start" justify="center" class="mt-5">
      <v-list>
        <v-overlay
          :absolute="true"
          :value="overlay"
        >
          <v-progress-circular :indeterminate="true">
          </v-progress-circular>
        </v-overlay>
        <v-list-item-group>
          <v-list-item v-for="network in networks" :key="network.ssid + network.strength" @click.stop="showDialog(network.ssid)">
            <v-list-item-avatar>
              <v-icon>{{ `mdi-wifi-strength-${network.strength > 80 ? '1' : network.strength > 70 ? '2' : '3'}` }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ network.ssid }}
                <v-icon  class="ml-3 mb-2" v-if="network.ssid === currentNetwork">mdi-check-bold</v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-row>
    <!-- Dialog that opens when network is selected -->
    <v-dialog
      v-model="dialogVisible"
      max-width="600px"
      >
      <v-card>
        <v-card-title
         class="headline grey">
          {{ selectedNetwork }}
        </v-card-title>
        <v-card-text>
          <v-col>
            <v-row>
              Enter the password for this network:
            </v-row>
            <v-row>
              <v-text-field
                v-model="wifiPassword"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                name="wifiPassword"
                label="Enter the password"
                hint="Normal password"
                @click:append="showPassword = !showPassword"
                >
              </v-text-field>
            </v-row>
          </v-col>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            text
            @click="dialogVisible = false">
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="acceptDialog">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
  <v-col v-else>
    WIFI Settings are confirmed. Mirror should reboot now.
  </v-col>
</template>
<script>
const eventbus = require('../eventbus')
const sendEvents = require('../../lib/mirror_shared_code/socketEvents').frontendEvents
const receiveEvents = require('../../lib/mirror_shared_code/socketEvents').backendEvents

export default {
  data: () => ({
    networks: [],
    scanInProgress: false,
    scanHappened: false,
    selectedNetwork: '',
    dialogVisible: false,
    wifiPassword: '',
    showPassword: false,
    currentNetwork: '',
    overlay: false,
    confirmed: false
  }),
  created() {
    eventbus.emit('stopload')
  },
  methods: {
    async scan () {
       
      //Save this for later use
      const vm = this

      // When we receive the networks event, we set variables as required
      eventbus.on(receiveEvents.available_networks, (list) => {
        vm.scanHappened = true
        vm.scanInProgress = false
        vm.networks = list
      })

      // Sending the scan request to backend
      console.log('sending request to backend.')
      this.scanInProgress = true
      this.$socket.sendObj({ event: sendEvents.list_wifi })
    },
    async showDialog(ssid) {
      // Resetting variables so we dont keep old entries
      console.log('Dialog triggered for ssid: ' + ssid)
      this.selectedNetwork = ssid
      this.wifiPassword = ''
      this.showPassword = false
      this.dialogVisible = true
    },
    async acceptDialog() {
      const vm = this

      // Debug logging network infos.
      console.log('SSID: ' + this.selectedNetwork + ' Password: ' + this.wifiPassword)

      //Hiding dialog
      this.dialogVisible = false
      this.overlay = true

      //listening for backend notice about connection
      eventbus.on(receiveEvents.new_connection_result, (data) => {
        let snackBarText
        // if connection status is success, we show success, otherwise we show error snackbar.
        if (data.status) {
          snackBarText = 'Connection is setup.'
          vm.currentNetwork = data.ssid
        } else {
          snackBarText = 'Connection failed!'
          vm.currentNetwork = ''
        }
        vm.overlay = false
        eventbus.emit('snackbar', snackBarText)
      })


      // Send wificonnect request to backend
      this.$socket.sendObj({
          event: sendEvents.connect_wifi, 
          data: { 
            ssid: this.selectedNetwork, 
            password: this.wifiPassword 
          }
        })
    },
    confirmSettings() {
      this.confirmed = true
      this.$socket.sendObj({
        event: sendEvents.confirm_wifi_settings
      })
    }
  }
};
</script>