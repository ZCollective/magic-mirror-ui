<template>
  <v-col>
    <v-col v-if="logs.length > 0">
      <v-row justify="end" v-for="log in logs.slice().reverse()" :key="log.time">[{{log.time}}] - [{{log.message}}]</v-row>
    </v-col>
    <v-col v-else>No logs yet!</v-col>
  </v-col>
</template>
<script>
const eventbus = require('../../eventbus')
export default {
  name: "Logview",
  data: () => ({
    logs: []
  }),
  created() {
    eventbus.on('logevent', (message) => {
        if (this.logs.length >= 8) {
          this.logs.shift()
        }
        this.logs.push({time: new Date().toUTCString(), message: message})
    })
  },
  methods: {}
}
</script>