<template>
  <v-app :style="{background: $vuetify.theme.themes.dark.background}" style="height: 100%">
    <v-content v-show="!showLoader">
      <router-view></router-view>
    </v-content>
    <v-content v-show="showLoader">
      <Loader :text="loaderText" />
    </v-content>
    <v-snackbar
      v-model="showSnackbar">
      {{ snackBarText }}
      <v-btn color="white" text @click="showSnackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-footer v-if="showDebug" color="black" fixed>
      <DebugInfo/>
    </v-footer>
  </v-app>
</template>
<script>
const deviceDetection = require("mobile-device-detect");
const eventbus = require('./eventbus')
const sendEvents = require('../lib/mirror_shared_code/socketEvents').frontendEvents
const receiveEvents = require('../lib/mirror_shared_code/socketEvents').backendEvents

import Loader from "./components/Loader"
import DebugInfo from './components/DebugInfo'

export default {
  name: "App",
  components: {
    Loader,
    DebugInfo
  },
  data: () => ({
    showLoader: true,
    showContent: false,
    showQR: false,
    loaderText: "Starting...",
    password: "",
    showSnackbar: false,
    snackBarText: '',
    showDebug: process.env.VUE_APP_SHOW_DEBUG === 'true' && !deviceDetection.isMobile,
    socketReady: false
  }),
  created() {

    //saving this for later use
    const vm = this

    //defining loader events
    eventbus.on('load', text => {
      eventbus.emit('logevent', 'got load event!')
      vm.loaderText = text;
      vm.showLoader = true;
    });
    eventbus.on("stopload", () => {
      eventbus.emit('logevent', "got stopload event")
      vm.showLoader = false;
    });
    eventbus.on("snackbar", (text) => {
      vm.snackBarText = text
      vm.showSnackbar = true
    })

    //setting loader as startup dash. -> using eventbus to deduplicate code
    eventbus.emit('load', 'Starting...')

    // If we are on a mobile device, we start config
    if (deviceDetection.isMobile) {
      this.configDevice();
    } else {
      this.piDevice();
    }
  },
  methods: {

    //Method to run if we are on the pi
    piDevice() {

      //Saving this for later usage
      const vm = this;

      //we setup the listener for messages from backend.
      //we only listen for messages that are relevant.
      this.$options.sockets.onmessage = data => {
        const message = JSON.parse(data.data);
        switch (message.event) {
          case receiveEvents.first_start:
            eventbus.emit('logevent', 'first start was detected. Pushing to qrcode.')
            // Firststart is detected, so we continue with QR code
            vm.$router.push('qrcode')
            break;
          case receiveEvents.show_content:
            // Backend says we should show the content
            vm.$router.push('content')
            break;
          case receiveEvents.reboot:
            //Reboot signal, displaying reboot dash
            eventbus.emit('load', 'Rebooting...')
            break;
          default:
            //We dont need to care about this message in App.vue. Instead we are forwarding it through
            // the global event bus
            eventbus.emit(message.event, message.data || '')
            break;
        }
      };
      
      //As soon as the socket opens,we send ready signal to backend
      this.$socket.onopen = () => {
        this.$socket.sendObj({ event: sendEvents.ready });
        this.socketReady = true
      };

      this.$socket.onclose = () => {
        this.socketReady = false
      }

      eventbus.on('socketReady', () => {
        console.log('Received socketReady event')
        eventbus.emit(this.socketReady ? 'socketReadyConfirm' : 'socketReadyDeny')
      })
    },
    configDevice() {
      console.log("I am here for config!");
      const vm = this
      //As soon as the socket opens,we send ready signal to backend
      this.$socket.onopen = () => {
        this.$socket.sendObj({ event: sendEvents.config_ready });
      };
      this.$options.sockets.onmessage = data => {
        const message = JSON.parse(data.data);
        console.log('received message:')
        console.log(message)
        switch (message.event) {
          case receiveEvents.normal_config:
            console.log('received normal config. Pushing to normal config')
            // We should go to normal config.
            vm.$router.push('config')
            break;
          case receiveEvents.wifi_config:
            // Backend says we should show the wifi config.
            vm.$router.push('wificonfig')
            break;
          default:
            //We dont need to care about this message in App.vue. Instead we are forwarding it through
            // the global event bus
            eventbus.emit(message.event, message.data || '')
            break;
        }
      }
    },
  }
};
</script>
<style>
html {
  overflow-y: hidden !important;
}
</style>
