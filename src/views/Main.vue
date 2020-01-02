<template>
<v-container fluid style="height: 100%">
  <v-col cols="12" style="height: 100%" align="end" align-self="end">
    <v-row align="end" align-self="stretch" justify="space-between" style="height: 100%">
      <v-col cols="4">
        <comicPanel/>
        <v-spacer></v-spacer>
        <trashPanel/>
      </v-col>
      <v-col cols="4">
        <clockPanel/>
      </v-col>
      <v-col cols="4">
        <weatherPanel/>
      </v-col>
    </v-row>
  </v-col>
</v-container>
</template>

<script>
import weatherPanel from '../components/WeatherPanel'
import clockPanel from '../components/ClockPanel'
// import calendarPanel from '../components/CalendarPanel'
import trashPanel from '../components/TrashPanel'
import comicPanel from '../components/ComicPanel'
export default {
  name: 'Main',
  components: {
    WeatherPanel: weatherPanel,
    ClockPanel: clockPanel,
    /*CalendarPanel: calendarPanel,*/
    TrashPanel: trashPanel,
    ComicPanel: comicPanel
  },
  data: () => ({

  }),
};
</script>
