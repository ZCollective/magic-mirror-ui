<template>
  <v-container>
    <v-col>
      <v-btn block @click="testLoad">Test Loader</v-btn>
    </v-col>
  </v-container>
</template>

<script>
const eventbus = require("../../eventbus");

export default {
  data () {
    return {

    }
  },
  methods: {
    testLoad () {
      eventbus.emit('load', 'Test Loading')
      setTimeout(() => { eventbus.emit('stopload') }, 3000)
    }
  }
}
</script>