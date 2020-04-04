<template>
    <v-row class="mb-n3 py-n2 text-no-wrap text-center" justify="center">
      <v-col class="mt-0 pt-0">Host: {{host}}</v-col>
      <v-col class="mt-0 pt-0">Path: {{routepath}}</v-col>
      <v-col class="mt-0 pt-0">Mode: {{mode}}</v-col>
      <v-col class="mt-0 pt-0">Version: {{version}}</v-col>
      <v-col class="mt-0 pt-0">Build: {{build}}</v-col>
      <v-col class="mt-0 pt-0">BE Build: {{backendVersion}}</v-col>
      <v-col class="mt-0 pt-0">Device: {{deviceName}}</v-col>
    </v-row>
</template>

<script>
const eventbus = require('../eventbus')
const sendEvents = require('../../lib/mirror_shared_code/socketEvents').frontendEvents
const receiveEvents = require('../../lib/mirror_shared_code/socketEvents').backendEvents

export default {
  name: "DebugInfo",
  data: () => ({
    host: process.env.VUE_APP_HOST || window.location.hostname,
    routepath: "",
    mode: process.env.NODE_ENV,
    version: process.env.VUE_APP_VERSION,
    build: process.env.VUE_APP_BUILD_NUMBER,
    backendVersion: 'NA',
    deviceName: 'NA',
    retrySocketReady: true
  }),
  watch: {
    /*eslint-disable-next-line*/
    $route(to, from) {
      this.routepath = this.$route.path;
    }
  },
  created() {
    this.routepath = this.$route.path;

    //Defining listener for device info event
    eventbus.on(receiveEvents.device_info, (message) => {
      this.backendVersion = message.version
      this.deviceName = message.name
    })

    //We poll the APP.vue file if the websocket is open. We cannot add two listeners to the
    // onOpen, onClose and onMessage events :(
    eventbus.on('socketReadyConfirm', () => {
      console.log('Received socketReadyConfirm')
      this.$socket.sendObj({ event: sendEvents.get_device_info });
      this.retrySocketReady = false
    })
    eventbus.on('socketReadyDeny', () => {
      console.log('received socketReadyDeny')
      if(this.retrySocketReady){
        console.log('Sending socketReady event in 1 second')
        setTimeout(() => eventbus.emit('socketReady'), 1000)
      }
    })

    console.log('Emitting socketready')
    eventbus.emit('socketReady')
  },
  methods: {}
};
</script>
