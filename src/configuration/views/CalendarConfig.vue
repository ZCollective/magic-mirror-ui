<template>
  <v-container>
    <v-speed-dial v-model="fab" fixed bottom right direction="left" transition="scale">
      <template v-slot:activator>
        <v-btn v-model="fab" color="accent" dark fab>
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>{{existingCalendars ? 'mdi-calendar-edit' : 'mdi-plus'}}</v-icon>
        </v-btn>
      </template>
      <v-btn @click="addGoogleCalendar" fab dark small color="green">
        <v-icon>mdi-google</v-icon>
      </v-btn>
      <v-btn @click="addIcalCalendar" fab dark small color="green">
        <v-icon>mdi-apple</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-col>
      <v-col v-if="existingCalendars !== false">
        <v-row justify="center">
          <div class="title">Currently Available Calendars:</div>
        </v-row>
        <v-row>
            <v-list two-line>
              <v-list-item-group>
                <v-list-item v-for="calendar in existingCalendars.items" :key="calendar.id"
                  @click="changeExistingCalendar(calendar.id)">
                  <v-list-item-content>
                    <v-list-item-title>{{calendar.summary}}</v-list-item-title>
                    <v-list-item-subtitle>{{calendar.timeZone}}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon v-if="calendar.id === selectedCal">mdi-check</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
        </v-row>
      </v-col>
      <v-col v-else justify="center">
        <div class="headline">No Calendars Configured</div>
        <div class="title">Add one below!</div>
      </v-col>
      <v-row>
        <v-btn @click="confirmCalendar" block v-if="changedCal">
          Confirm new Calendar
        </v-btn>
      </v-row>
      <v-dialog v-model="calDialog">
              <v-card>
        <v-card-title class="headline">Add Google Calendar</v-card-title>
          <v-expansion-panels :value="showCalendarConfig" popout>
            <v-expansion-panel>
              <v-expansion-panel-content>
                <v-row justify="center" class="mt-8">
                  <v-text-field
                    outlined
                    v-model="authCode"
                    :rules="authCodeRules"
                    placeholder="Auth Token"
                  ></v-text-field>
                  <v-btn
                    class="mt-2"
                    :disabled="!authCode"
                    @click="getTokenAndListCalendars"
                    :loading="tokenCheckInProgress"
                  >Confirm</v-btn>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-col v-if="calendars.length > 0">
            <v-row justify="center" class="mb-3">
              <div>Please select which calender you want</div>
            </v-row>
            <v-row justify="center">
              <v-list two-line>
                <v-list-item-group v-model="selectedCalendar">
                  <v-list-item v-for="calendar in calendars" :key="calendar.id">
                    <v-list-item-content>
                      <v-list-item-title>{{calendar.summary}}</v-list-item-title>
                      <v-list-item-subtitle>{{calendar.timeZone}}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon v-if="selectedCalendar === calendar.index">mdi-check</v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-row>
            <v-row justify="center" class="mt-8">
              <v-btn @click="confirmCalendar">Confirm Selection</v-btn>
            </v-row>
          </v-col>
        <v-card-text>
        </v-card-text>
      </v-card>

      </v-dialog>
    </v-col>
  </v-container>
</template>

<script>
const eventbus = require("../../eventbus");
const calendarService = require("../../services/calendarService");

export default {
  data() {
    return {
      showCalendarConfig: undefined,
      authToken: undefined,
      authCode: undefined,
      authCodeRules: [value => !!value || "Required."],
      authUrl: "",
      tokenCheckInProgress: false,
      calendars: [
      /*
      {index: 0, kind: "calendar#calendarListEntry", etag: "1460913203622000", id: "michael.zigldrum@gmail.com", summary: "Termine", timeZone: "Europe/Berlin"},
      {index: 1, kind: "calendar#calendarListEntry", etag: "1553432473549000", id: "addressbook#contacts@group.v.calendar.google.com", summary: "Contacts", timeZone: "Europe/Berlin"},
      {index: 2, kind: "calendar#calendarListEntry", etag: "1427024741428000", id: "de.german#holiday@group.v.calendar.google.com", summary: "Feiertage in Deutschland", timeZone: "Europe/Berlin"},
      {index: 3, kind: "calendar#calendarListEntry", etag: "0", id: "e_2_de#weeknum@group.v.calendar.google.com", summary: "Week Numbers", timeZone: "Europe/Berlin"}
      */
      ],
      selectedCalendar: 0,
      existingCalendars: false,
      fab: false,
      changedCal: false,
      selectedCal: '',
      calDialog: false
    };
  },
  async created() {
    await this.loadPage()
  },
  methods: {
    async addGoogleCalendar() {
      try {
        let response = await calendarService.getAuthURL();
        this.authUrl = response.data;
        this.showCalendarConfig = 0;
        this.calDialog = true
        window.open(this.authUrl, "_blank");
      } catch (error) {
        console.log(error);
        eventbus.emit("snackbar", "Failure when updating the system!");
      }
    },
    async getTokenAndListCalendars() {
      try {
        console.log(this.authCode);
        let response = await calendarService.postGoogleCode(this.authCode);
        let token = response.data;
        this.authToken = token;
        response = await calendarService.listCalendars(token);
        let i = 0;
        this.calendars = response.data.items.map(elem => {
          let e = elem;
          e.index = i;
          i++;
          return e;
        });
        this.showCalendarConfig = false;
        console.log(response);
      } catch (error) {
        console.log(error);
        eventbus.emit("snackbar", "Failure accessing Google Calendars");
      }
    },
    async addIcalCalendar() {
      eventbus.emit("snackbar", "Icals are not supported yet!");
    },
    async confirmCalendar() {
      try {
        let calID = ''
        if (this.changedCal) calID = this.selectedCal
        else calID = this.calendars[this.selectedCalendar].id
        await calendarService.postGoogleID(
          calID
        )
        this.calendars = [];
        this.showCalendarConfig = undefined;
        this.calDialog = false
        this.changedCal = false
        eventbus.emit("snackbar", "Saved Calendar Configuration");
        await this.loadPage()
      } catch (error) {
        console.log(error);
        eventbus.emit("snackbar", "Failure saving selected Google Calendar");
      }
    },
    async changeExistingCalendar(newCal) {
      if (this.existingCalendars.original === newCal) {
        this.changedCal = false
      } else {
        this.changedCal = true
      }
      this.selectedCal = newCal
    },
    async loadPage () {
      eventbus.emit("stopload");
      try {
        let response = await calendarService.getCalendarInfo();
        if (response.data.type === "google") {
          // We already have a google calendar added. Get Info and display it.
          const selectedID = response.data.id
          response = await calendarService.listCalendars(response.data.token)
          console.log(response.data);
          this.existingCalendars = response.data;
          this.existingCalendars.type = "google";
          this.existingCalendars.original = selectedID
          this.selectedCal = selectedID
        }
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>