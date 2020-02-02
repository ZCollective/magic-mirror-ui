<template>
  <v-skeleton-loader
    v-if="loading"
    :loading="true"
    transition="fade-transition"
    height="94"
    type="list-item-two-line">
      </v-skeleton-loader>

  <v-card v-else
    color="#000000"
  >
    <v-row class="text-center">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="display-4 py-4">{{cityName}}</v-list-item-title>
          <!--<v-list-item-subtitle class="display-1">{{dayDictionary[days[activeDay].weekday]}}, {{days[activeDay].condition}}</v-list-item-subtitle>-->
        </v-list-item-content>
      </v-list-item>
    </v-row>
  <v-row justify="center" align="center">
    <v-col>
    <v-card-text>
      <v-row align="center" justify="center">
        <v-col class="display-4" cols="8" align="center" justify="center">
          {{days[activeDay].avg}}&deg;C
        </v-col>
        <v-col cols="4" justify="center" align="center">
          <v-icon size="100px">{{iconDictionary[days[activeDay].icon]}}</v-icon>
        </v-col>
      </v-row>
      
    </v-card-text>
        <v-list-item>
      <v-list-item-icon class="ml-5 mr-n6">
        <v-icon size="70px">mdi-weather-windy</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle class="ml-n4 mr-0 display-2">{{days[activeDay].wind}} km/h</v-list-item-subtitle>
    </v-list-item>
    </v-col>
    <v-col align="center" justify="center">

    <v-list class="transparent">
      <v-list-item
        v-for="item in days.slice(1)"
        :key="item.weekday"
        dense
        class="mb-4"
      >
        <v-list-item-title class="display-1 py-4">{{ dayDictionary[item.weekday] }}</v-list-item-title>

        <v-list-item-icon>
          <v-icon size="50px">{{iconDictionary[item.icon]}}</v-icon>
        </v-list-item-icon>

        <v-list-item-subtitle class="text-right display-1 py-4">
          {{ item.avg }}&deg;
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    </v-col>

  </v-row>
  <v-row v-if="doSwitchDays">
            <v-slider
      v-model="activeDay"
      :max="days.length"
      :tick-labels="availableDays"
      class="mx-4"
      ticks
    ></v-slider>
  </v-row>
  </v-card>
</template>
<script>
import weatherService from '@/services/weatherService'

export default {
  data () {
    return {
      city: '2878695',
      cityName: '',
      days: [
      ],
      activeDay: 0,
      intervalHandle: undefined,
      dayDictionary: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      availableDays: [],
      loading: true,
      autoReloadTimer: undefined,
      doSwitchDays: false,
      iconDictionary: {
        '01d': 'mdi-white-balance-sunny',
        '02d': 'mdi-weather-partly-cloudy',
        '03d': 'mdi-weather-cloudy',
        '04d': 'mdi-weather-cloudy',
        '09d': 'mdi-weather-rainy',
        '10d': 'mdi-weather-pouring',
        '11d': 'mdi-weather-lightning',
        '13d': 'mdi-weather-snowy-heavy',
        '50d': 'mdi-weather-fog'
      }
    }
  },
  created () {
    this.getForecast()
    var vm = this
    this.autoReloadTimer = setInterval(() => vm.getForecast(), 10*60*1000)
  },
  methods: {
    async getForecast() {
      try {
        var response = await weatherService.get5DayForecast(this.city)
        this.cityName = response.data.city.name
        var entries = response.data.list
        entries = entries.map(entry => {
          var date = new Date(entry.dt * 1000)
          entry.dateObj = date
          return entry
        })
        var forecastMap = new Map()
        entries.forEach(entry => {
          var key = `${entry.dateObj.getUTCDate()}-${entry.dateObj.getUTCMonth()}-${entry.dateObj.getUTCFullYear()}`
          if (forecastMap.has(key)) {
            forecastMap.set(key, forecastMap.get(key).concat([entry]))
          } else {
            forecastMap.set(key, [entry])
          }
        })
        var promises = []
        for (let entry of forecastMap) {
          promises.push(this.calculateDay(entry[1], entry[0]))
        }
        var days = await Promise.all(promises)
        this.days = days
        for (let day of days) {
          this.availableDays.push(this.dayDictionary[day.weekday])
        }
        if (this.doSwitchDays) {
          this.setRotation()
        } else {
         this.activeDay = 0
        }
        this.loading = false
        console.log(days)
      } catch (error) {
        console.log(error)
        this.days = []
      }
    },
    setRotation() {
      console.log('Setting interval')
      const vm = this
      if (this.intervalHandle === undefined || this.intervalHandle === null) {
        this.intervalHandle = setInterval(() => { vm.activeDay = (vm.activeDay +1) % vm.days.length;console.log('incremented')}, 10000)
      }
    },
    stopTimer() {
      console.log('Stopping interval.')
      clearInterval(this.intervalHandle)
    },
    calculateDay(forecasts, day) {
      return new Promise((resolve, reject) => {
        try {
          // var nameCount = {}
          var conditionCount = {}
          var iconCount = {}
          var avg = 0
          var min = 1000
          var max = -300
          var avgWind = 0
          for (let forecast of forecasts) {
            // handling min temp
            if (forecast.main.temp_min < min) min = forecast.main.temp_min
            // handling max temp
            if (forecast.main.temp_max > max) max = forecast.main.temp_max
            // handling avg temp
            avg = avg + forecast.main.temp
            // handling conditionCount
            if (conditionCount[forecast.weather[0].description]) conditionCount[forecast.weather[0].description] = conditionCount[forecast.weather[0].description] + 1
            else conditionCount[forecast.weather[0].description] = 1
            // handling iconCount
            if (iconCount[forecast.weather[0].icon]) iconCount[forecast.weather[0].icon] = iconCount[forecast.weather[0].icon] + 1
            else iconCount[forecast.weather[0].icon] = 1
            // handling avg wind speed
            avgWind = avgWind + forecast.wind.speed
          }
          // dividing avg through total
          avg = Math.round((avg/forecasts.length))
          avgWind = Math.round((avgWind/forecasts.length))
          // getting most often occurring condition:
          var condition = Object.keys(conditionCount).reduce((prev, current) =>  {
            return conditionCount[prev] > conditionCount[current] ? prev : current
          })
          // getting most often occurring icon:
          var icon = Object.keys(iconCount).reduce((prev, current) =>  {
            return iconCount[prev] > iconCount[current] ? prev : current
          })
          var date = new Date()
          var splitDay = day.split('-')
          date.setDate(parseInt(splitDay[0]))
          date.setMonth(parseInt(splitDay[1]))
          date.setUTCFullYear(parseInt(splitDay[2]))
          resolve({
            weekday: date.getDay(),
            date: forecasts[0].dateObj,
            condition: condition,
            icon: icon.replace('n', 'd'),
            min: min,
            max: max,
            avg: avg,
            wind: avgWind
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
</script>