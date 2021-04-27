<template>
  <v-card color="#000000" class="mt-7 ml-7">
    <v-row>
      <v-col>
        <v-row>
          <v-col class="full-day-events">
            <v-row align="center">
              <div class="display-1 ml-4 py-3">Termine:</div>
              <v-spacer></v-spacer>
              <v-icon size="40px" class="mr-4">mdi-calendar-multiple</v-icon>
            </v-row>
            <!--<v-row class="ml-3" v-for="event in fullDayEvents" :key="event.id">
              <v-icon class="ml-10" size="40px">mdi-circle-small</v-icon>
              <div class="title mt-1">{{event.summary}}</div>
            </v-row>-->
          </v-col>
        </v-row>
        <v-row>
          <v-timeline dense color="#000000" class="mt-3">
            <v-timeline-item
              class="pb-0"
              v-for="event in timelineEvents"
              :key="event.id"
              color="#cccccc"
              fill-dot
              small
            >
              <v-card color="#000000" class="text-left">
                <v-list-item two-line>
                  <v-list-item-content v-if="!event.datemarker" class="pt-0">
                    <v-list-item-title class="headline py-2">{{event.summary}}</v-list-item-title>
                    <v-list-item-subtitle>{{event.mirror_custom_interval}}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content v-else>
                    <v-list-item-title
                      v-bind:class="{datemarker: !event.first}"
                      class="font-weight-bold headline py-2"
                    >{{event.string}}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
const eventbus = require("../../eventbus");
const calendarService = require("../../services/calendarService");

export default {
  data() {
    return {
      activeEvent: null,
      fullDayEvents: [],
      timelineEvents: [],
      eventList: [],
      intervalHandle: undefined,
      token: "",
      calendarID: ""
    };
  },
  created() {
    this.getNextEvents();
    const vm = this
    this.intervalHandle = setInterval(vm.getNextEvents, (10 * 60 * 1000))
  },
  methods: {
    async getNextEvents() {
      eventbus.emit('logevent', '|CALENDAR| Getting updated events.')
      const currentDateObj = new Date()
      let currentDateAsString = `${this.pad(currentDateObj.getFullYear(), 4)}-${this.pad(currentDateObj.getMonth(), 2)}-${this.pad(currentDateObj.getDate(), 2)}`
      try {
        let response = await calendarService.getCalendarInfo();
        this.token = response.data.token;
        this.calendarID = response.data.id;
        console.log('Calendar details from server: ', response)
        eventbus.emit('logevent', '|CALENDAR| Received token: ' + response.data.token)
        //Starting getEvents and setting intervalhandler
        response = await calendarService.getNextEvents(
          this.token,
          this.calendarID,
          10
        );
        console.log(response);
        this.eventList = response.data.items;
        this.timelineEvents = response.data.items.filter(event => {
          console.log(event);
          return event.start.dateTime || (event.start.date && event.start.date !== currentDateAsString) ? true : false;
        });
                this.fullDayEvents = response.data.items.filter(event => {
          return event.start.date && event.start.date === currentDateAsString ? true : false;
        });

        this.timelineEvents = this.timelineEvents.map(event => {
          if (event.start.dateTime) {
            let start = new Date(event.start.dateTime);
            let end = new Date(event.end.dateTime);
            let interval =
              this.pad(start.getHours(), 2) +
              ":" +
              this.pad(start.getMinutes(), 2) +
              " - " +
              this.pad(end.getHours(), 2) +
              ":" +
              this.pad(end.getMinutes(), 2) +
              " | TZ: " +
              event.start.timeZone;
            event.mirror_custom_interval = interval;
            event.formattedDate = `${this.pad(start.getDate(), 2)}.${this.pad(
              start.getMonth() + 1,
              2
            )}.${this.pad(start.getFullYear(), 4)}`;
          } else if (event.start.date) {
            event.mirror_custom_interval = 'Ganzer Tag'
            event.start.dateTime = new Date(event.start.date)
            event.formattedDate = `${this.pad(event.start.dateTime.getDate(), 2)}.${this.pad(event.start.dateTime.getMonth() + 1, 2)}.${this.pad(event.start.dateTime.getFullYear(), 4)}`;
            event.start.dateTime = event.start.dateTime.toISOString()
          }
          return event;
        });

        // Inserting Date elements
        let currentDate;
        let markers = 0;
        let firstLoop = true
        for (let i = 0; i < this.timelineEvents.length; i++) {
          if (currentDate !== this.timelineEvents[i].formattedDate || firstLoop) {
            const current = new Date()
            const today = new Date(current.getFullYear(), current.getMonth(), current.getDate())
            const tomorrow = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1)
            const overmorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate() + 1)
            const entry = new Date(this.timelineEvents[i].start.dateTime)
            if (today.getFullYear() === entry.getFullYear() && today.getMonth() === entry.getMonth() && today.getDate() === entry.getDate()) markers = 0
            else if (tomorrow.getFullYear() === entry.getFullYear() && tomorrow.getMonth() === entry.getMonth() && tomorrow.getDate() === entry.getDate()) markers = 1
            else if (overmorrow.getFullYear() === entry.getFullYear() && overmorrow.getMonth() === entry.getMonth() && overmorrow.getDate() === entry.getDate()) markers = 2
            else markers = 3
            firstLoop = false
            currentDate = this.timelineEvents[i].formattedDate;
            let visibleString;
            switch (markers) {
              case 0:
                visibleString = "Heute";
                break;
              case 1:
                visibleString = "Morgen";
                break;
              case 2:
                visibleString = "Übermorgen";
                break;
              default:
                visibleString = currentDate;
                break;
            }
            this.timelineEvents.splice(i, 0, {
              datemarker: true,
              string: visibleString,
              id: Math.random(),
              first: i === 0
            });
            markers++;
            i++;
          }
        }
        if (this.timelineEvents.length > 11) {
          console.log('Events before cutoff: ')
          console.log(JSON.parse(JSON.stringify(this.timelineEvents)))
          let cutoff = this.timelineEvents[11].datemarker ? 11 : 12
          console.log('Cutoff -> ' + cutoff)
          this.timelineEvents = this.timelineEvents.splice(0, cutoff)
          console.log('Events after cutoff: ')
          console.log(JSON.parse(JSON.stringify(this.timelineEvents)))
        }
      } catch (error) {
        console.log('Error getting calendar events: ', error);
        eventbus.emit('snackbar', 'Could not load Calendar Events!')
        eventbus.emit('logevent', 'Error loading Calendar: ' + error)
      }
    },
    pad(num, len) {
      return (Array(len).join("0") + num).slice(-len);
    }
  }
};
</script>
<style>
.theme--dark.v-timeline:before {
  background: #aaaaaa;
  width: 3px;
}
.full-day-events {
  border-radius: 20px;
  border-width: 3px;
  border-style: solid;
  border-color: #aaaaaa;
}
.datemarker {
  border-top: 2px solid #aaaaaa;
}
</style>