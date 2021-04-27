<template>
  <v-container>
    <v-row justify="start" class="mb-6 mt-2 ml-2">
      <v-icon size="30px" class="mr-5">
        mdi-mirror
      </v-icon>
      <div class="headline">{{name}}</div>
    </v-row>
    <v-divider></v-divider>
    <v-list>
      <v-list-item to="general" link>
        <v-list-item-icon>
          <v-icon>mdi-tune</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Settings</v-list-item-content>
      </v-list-item>
      <v-list-item to="calendar" link>
        <v-list-item-icon>
          <v-icon>mdi-calendar</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Calendars</v-list-item-content>
      </v-list-item>
      <v-list-item to="update" link>
        <v-list-item-icon>
          <v-icon>mdi-cellphone-arrow-down</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Updates</v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-forum</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Feedback</v-list-item-content>
      </v-list-item>
      <v-list-item v-if="dev" to="dev" link>
        <v-list-item-icon>
          <v-icon>mdi-developer-board</v-icon>
        </v-list-item-icon>
        <v-list-item-content>DevOptions</v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script>
const deviceService = require('../../services/deviceService')
const eventbus = require("../../eventbus");

export default {
  props: {
    dev: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: ''
    };
  },
  async created() {
    this.routepath = this.$route.path;
    try {
      let response = await deviceService.getInfo()
      console.log(response.data)
      this.name = response.data.name
    } catch (error) {
      console.log(error)
      eventbus.emit('snackbar', 'Error loading Device Info')
    }
  }
};
</script>