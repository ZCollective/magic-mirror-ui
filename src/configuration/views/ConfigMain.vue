<template>
  <v-container>
    <router-view></router-view>
  </v-container>
</template>

<script>
import configService from "@/services/configService";
const eventbus = require("../../eventbus");
const updateService = require('../../services/updateService')
export default {
  name: "ConfigMain",
  data: () => ({
    testResult: "No Test has been run!",
    updateAvailable: false,
    updateBusy: false,
    updateSuccessful: false,
    updateInProgressBusy: false,
    showCalendarConfig: undefined,
    authToken: undefined,
    authCode: undefined,
    authCodeRules: [value => !!value || "Required."],
    authUrl: '',
    tokenCheckInProgress: false,
    calendars: [
      /*
      {index: 0, kind: "calendar#calendarListEntry", etag: "1460913203622000", id: "michael.zigldrum@gmail.com", summary: "Termine", timeZone: "Europe/Berlin"},
      {index: 1, kind: "calendar#calendarListEntry", etag: "1553432473549000", id: "addressbook#contacts@group.v.calendar.google.com", summary: "Contacts", timeZone: "Europe/Berlin"},
      {index: 2, kind: "calendar#calendarListEntry", etag: "1427024741428000", id: "de.german#holiday@group.v.calendar.google.com", summary: "Feiertage in Deutschland", timeZone: "Europe/Berlin"},
      {index: 3, kind: "calendar#calendarListEntry", etag: "0", id: "e_2_de#weeknum@group.v.calendar.google.com", summary: "Week Numbers", timeZone: "Europe/Berlin"}
      */
    ],
    selectedCalendar: 0
  }),
  created() {
    eventbus.emit("stopload");
  },
  methods: {
    async testConnection() {
      try {
        let response = await configService.testConnection();
        console.log(response);
        this.testResult = "Success!";
      } catch (error) {
        this.testResult = "Failed because of " + error;
      }
    },
    async checkForUpdate() {
      this.updateBusy = true
      try {
        let response = await updateService.getAvailable()
        if (response.data) {
          eventbus.emit('snackbar', 'Update Available!')
          this.updateAvailable = true
        } else {
          eventbus.emit('snackbar', 'No new Updates!')
          this.updateAvailable = false
        }
      } catch (error) {
        console.log(error)
        eventbus.emit('snackbar', 'Failed to check for update!')
      } finally {
        this.updateBusy = false
      }
    },
    async updateNow() {
      this.updateInProgressBusy = true;
      try {
        let response = await updateService.updateNow()
        if (response.data) {
          eventbus.emit('snackbar', 'Update successful. Rebooting now.')
          this.updateAvailable = false
          this.updateInProgressBusy = false
          this.updateSuccessful = true
        } else {
          eventbus.emit('snackbar', 'Error during update!')
          this.updateAvailable = true
          this.updateInProgressBusy = false
          this.updateSuccessful = false
        }
      } catch (error) {
        console.log(error)
        eventbus.emit('snackbar', 'Failure when updating the system!')
        this.updateAvailable = true
        this.updateInProgressBusy = false
        this.updateSuccessful = false
      }
    },
  }
};
</script>
