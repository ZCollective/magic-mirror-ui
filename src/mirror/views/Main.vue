<template>
<v-container fluid style="height: 100%" class="mt-0 pa-0">
  <v-row class="pa-0">
    <v-col cols="12" class="pa-0">
      <v-row justify="space-between" class="pa-0">
        <v-col cols="3">
          <calendarPanel/>
        </v-col>
        <v-col class="mt-0 pt-0" cols="3">
          <clockPanel/>
        </v-col>
        <v-col class="mt-0 pt-0 mr-4" cols="3">
          <weatherPanel/>
          <factNewsPanel class="mt-8"/>
        </v-col>        
      </v-row>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import weatherPanel from '../components/WeatherPanel'
import clockPanel from '../components/ClockPanel'
import factNewsPanel from '../components/Fact_NewsPanel'
import calendarPanel from '../components/CalendarPanel'
// import trashPanel from '../components/TrashPanel'
// import comicPanel from '../components/ComicPanel'
// import logView from '../components/LogView'
const eventbus = require('../../eventbus')


export default {
  name: 'Main',
  components: {
    WeatherPanel: weatherPanel,
    ClockPanel: clockPanel,
    CalendarPanel: calendarPanel,
    /*TrashPanel: trashPanel,*/
    FactNewsPanel: factNewsPanel,
    //LogView: logView
    /*LogView*/
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
