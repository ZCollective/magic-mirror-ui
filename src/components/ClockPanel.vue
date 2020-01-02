<template>
  <v-skeleton-loader v-if="loading">

  </v-skeleton-loader>
  <v-card v-else color="#000000">
    <v-row align="center" justify="center">
      <v-col justify="center">
        <v-list-item two-line justify="center" align="center">
          <v-list-item-content justify="center">
            <v-list-item-title class="display-4">{{timeString}} </v-list-item-title>
            <v-list-item-subtitle class="title">{{dayDictionary[currentDay]}}, {{dateString}}</v-list-item-subtitle>
          </v-list-item-content>  
        </v-list-item>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  data () {
    return {
      showSeconds: false,
      city: 'Leonberg',
      timeString: '--:--:--',
      dayDictionary: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      currentDay: 0,
      dateString: '--.--.----',
      loading: true,
      refreshTimerHandle: undefined
    }
  },
  created() {
    var vm = this
    this.calculateDate()
    this.refreshTimerHandle = setInterval(vm.calculateDate, vm.showSeconds ? 200 : 20000)
  },
  methods: {
    calculateDate() {
      var currentDate = new Date()
      if (this.showSeconds) {
        this.timeString = `${currentDate.getHours()>= 10 ? currentDate.getHours() : '0' + currentDate.getHours()}:${currentDate.getMinutes()>= 10 ? currentDate.getMinutes() : '0' + currentDate.getMinutes()}:${currentDate.getSeconds()>= 10 ? currentDate.getSeconds() : '0' + currentDate.getSeconds()}`
      } else {
        this.timeString = `${currentDate.getHours()>= 10 ? currentDate.getHours() : '0' + currentDate.getHours()}:${currentDate.getMinutes()>= 10 ? currentDate.getMinutes() : '0' + currentDate.getMinutes()}`
      }
      this.currentDay = currentDate.getDay()
      this.dateString = `${currentDate.getDate()}.${currentDate.getMonth() +1}.${currentDate.getFullYear()}`
      this.loading = false
    }
  }
}
</script>