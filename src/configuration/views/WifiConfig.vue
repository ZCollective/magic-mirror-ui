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
const eventbus = require('../../eventbus')
const wifiService = require('../../services/wifiService')

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
      this.scanInProgress = true
      try {
        let response = await wifiService.getNetworks()
        this.networks = response.data
      } catch (error) {
        eventbus.emit('snackbar', 'Error scanning for networks!')
        console.log(error)
      }
      this.scanInProgress = false
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
      // Debug logging network infos.
      console.log('SSID: ' + this.selectedNetwork + ' Password: ' + this.wifiPassword)


      //Hiding dialog
      this.dialogVisible = false
      this.overlay = true

      try {
        let response = await wifiService.connect(this.selectedNetwork, this.wifiPassword)
        this.currentNetwork = response.data
        eventbus.emit('snackbar', 'Connection is Setup')
      } catch (error) {
        eventbus.emit('snackbar', 'Error connecting to networks!')
        console.log(error)
      }
      this.overlay = false
    },
    async confirmSettings() {
      try {
        await wifiService.confirmConfig()
        eventbus.emit('snackbar', 'Set Wifi. Rebooting now.')
      } catch (error) {
        console.log(error)
        eventbus.emit('snackbar', 'Error confirming Selection!')
      }
    }
  }
};
</script>