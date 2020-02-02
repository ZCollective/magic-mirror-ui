<template>
  <v-card
  color="#000000" class="mt-8">
    <v-row v-if="activeEvent !== undefined && activeEvent !== null" class="text-left mb-0" justify="start">
      <v-col>
            <v-icon size="70px">mdi-trash-can-outline</v-icon>
      </v-col>
      <v-col>
        <v-list-item-title class="display-2 py-3">{{activeEvent.DESCRIPTION}} </v-list-item-title>
        <v-list-item-subtitle class="display-1 py-2">
          {{`${activeEvent.dateObj.getDate() >= 10 ? activeEvent.dateObj.getDate() : '0' + activeEvent.dateObj.getDate()}.
                    ${activeEvent.dateObj.getMonth() >= 9 ? (activeEvent.dateObj.getMonth() +1 ) : '0' + (activeEvent.dateObj.getMonth() +1 )}.
                    ${activeEvent.dateObj.getFullYear() >= 10 ? activeEvent.dateObj.getFullYear() : '0' + activeEvent.dateObj.getFullYear()}`}}
          </v-list-item-subtitle>
      </v-col>
    </v-row>
    <v-row v-else class="text-left mb-0" justify="start">
        <v-icon size="70px">mdi-trash-can-outline</v-icon>
        <h1 class="display-1 py-4 ml-7">Keine aktuellen Termine</h1>
    </v-row>
    <v-row align="start" class="text-left mt-0">
      <v-col>
        <v-timeline dense color="#000000">
          <v-timeline-item small fill-dot v-for="event in eventList" :key="event.UID" class="pa-0" color="#cccccc">
            <v-card color="#000000">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="headline py-2">
                    {{`${event.dateObj.getDate() >= 10 ? event.dateObj.getDate() : '0' + event.dateObj.getDate()}.
                    ${event.dateObj.getMonth() >= 9 ? (event.dateObj.getMonth() +1 ) : '0' + (event.dateObj.getMonth() +1 )}.
                    ${event.dateObj.getFullYear() >= 10 ? event.dateObj.getFullYear() : '0' + event.dateObj.getFullYear()}
                    - ${event.SUMMARY}`}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import calendar from '../assets/trashCalendar.json'
export default {
  data () {
    return {
      activeEvent: null,
      eventList: [],
      intervalHandle: undefined
    }
  },
  created () {
    // launching method to get the next events
    this.getNextEvents()
    var vm = this
    console.log('Starting trash interval...')
    this.intervalHandle = setInterval(() => vm.getNextEvents(),30 * 60 * 1000)
  },
  methods: {
    getNextEvents () {
      console.log('Running Trash refresh.')
      var events = calendar.VCALENDAR[0].VEVENT
      events = events.map(event => {
        var eventDate = event['DTSTART;VALUE=DATE']
        var year = parseInt(eventDate.substring(0,4))
        var month = parseInt(eventDate.substring(4,6))-1
        var day = parseInt(eventDate.substring(6))
        event.dateObj = new Date(year, month, day)
        return event
      })
      var currentDate = new Date()
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
      events = events.filter(event => {
        var timedifference = event.dateObj.getTime() - currentDate.getTime()
        return timedifference < 0 ? false : true
      })

      if ((events[0].dateObj.getTime() - currentDate.getTime()) <= (1.5*24*60*60*1000)) {
        console.log('Detected active event!')
        this.activeEvent = events[0]
        events = events.slice(1)
      } else {
        this.activeEvent = null
      }
      this.eventList = events.slice(0, (events.length > 5 ? 5 : events.length))
    }
  }
}
</script>
<style>
.theme--dark.v-timeline:before {
    background: #aaaaaa;
}
</style>