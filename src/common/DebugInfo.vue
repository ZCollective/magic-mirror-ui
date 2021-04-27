<template>
    <v-row class="mb-n3 py-n2 text-no-wrap text-center" justify="center">
      <v-col class="mt-0 pt-0">Host: {{host}}</v-col>
      <v-col class="mt-0 pt-0">Path: {{routepath}}</v-col>
      <v-col class="mt-0 pt-0">Mode: {{mode}}</v-col>
      <v-col class="mt-0 pt-0">Version: {{version}}</v-col>
      <v-col class="mt-0 pt-0">Build: {{build}}</v-col>
      <v-col class="mt-0 pt-0">Backend: {{backendVersion}}</v-col>
      <v-col class="mt-0 pt-0">Device: {{deviceName}}</v-col>
    </v-row>
</template>

<script>
const deviceService = require('../services/deviceService')
export default {
  name: "DebugInfo",
  data: () => ({
    host: (process.env.VUE_APP_HOST || window.location.hostname) + ':' + (process.env.VUE_APP_BACKEND_PORT || '80'),
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
  async created() {
    this.routepath = this.$route.path;
    try {
      let response = await deviceService.getInfo()
      console.log(response)
      this.backendVersion = response.data.version + '-' + response.data.buildnum
      this.deviceName = response.data.name
    } catch (error) {
      console.log(error)
    }
  },
  methods: {}
};
</script>
