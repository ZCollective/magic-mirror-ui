<template>
<v-container fluid style="height: 100%" class="mt-0 pt-0">
  <v-col cols="12" style="height: 100%" align="end" align-self="end" class="mt-0 pt-0">
    <v-row align="start" justify="space-between" style="height: 100%" class="mt-0 pt-0">
      <v-col xs="12" sm="6" md="6" lg="4" xl="4" class="mt-0 pt-0">
        <!--<comicPanel/>
        <v-spacer></v-spacer>-->
        <trashPanel/>
      </v-col>
      <v-col xs="12" sm="6" md="6" lg="4" xl="4" class="mt-0 pt-0">
        <clockPanel/>
      </v-col>
      <v-spacer></v-spacer>
      <v-col xs="12" sm="6" md="6" lg="3" xl="3" class="mt-0 pt-0">
        <weatherPanel/>
      </v-col>
      <v-col xs="12" sm="6" md="6" lg="3" xl="3" class="mt-0 pt-0 px-0">
        <factNewsPanel/>
      </v-col>
      <v-col xs="12" sm="12" md="6" lg="5" xl="4" class="mt-0 pt-0 px-0">
        <LogView/>
      </v-col>      
    </v-row>
  </v-col>
</v-container>
</template>

<script>
import weatherPanel from '../components/WeatherPanel'
import clockPanel from '../components/ClockPanel'
import factNewsPanel from '../components/Fact_NewsPanel'
// import calendarPanel from '../components/CalendarPanel'
import trashPanel from '../components/TrashPanel'
// import comicPanel from '../components/ComicPanel'
import LogView from '../components/LogView'
const eventbus = require('../eventbus')
//const sendEvents = require('../../lib/mirror_shared_code/socketEvents').frontendEvents
//const receiveEvents = require('../../lib/mirror_shared_code/socketEvents').backendEvents


export default {
  name: 'Main',
  components: {
    WeatherPanel: weatherPanel,
    ClockPanel: clockPanel,
    /*CalendarPanel: calendarPanel,*/
    TrashPanel: trashPanel,
    FactNewsPanel: factNewsPanel,
    LogView
    /* ComicPanel: comicPanel*/
  },
  data: () => ({
    showDebug: (process.env.VUE_APP_SHOW_DEBUG === 'true')
  }),
  created() {
    eventbus.emit('stopload')
  }
};
</script>
