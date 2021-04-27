<template>
  <v-row color="#000000" class="">
    <v-col>
      
      <!-- Current temperature -->
      <v-row justify="space-around" align="center" class="mt-3 mb-2 mx-auto">
        <div class="display-4">{{current.avg}}&deg;C</div>
        <v-icon size="100px">{{iconDictionary[current.icon]}}</v-icon>
      </v-row>

      <!-- Current Wind Row -->
      <v-row align="center" justify="space-around" class="mx-auto mb-2">
        <v-icon size="70px">mdi-weather-windy</v-icon>
        <h1 class="display-2 mr-n3">{{current.wind}} km/h</h1>
      </v-row>

      <!-- Location Text -->
      <div class="display-3 text-center mb-4">{{cityName}}</div>

      <!-- Forecast for next days -->
      <v-row align="center" justify="space-around">
        <v-col v-for="item in days" :key="item.weekday" class="mx-2 weather_day px-3 py-0">
          <v-row justify="center" class="display-1 mb-1 mt-n1">{{ dayDictionary[item.weekday] }}</v-row>

          <v-row justify="center" class="my-2">
            <v-icon size="40px">{{iconDictionary[item.icon]}}</v-icon>
          </v-row>

          <v-row justify="center" class="display-1 mt-1 mb-1">{{ item.avg }}&deg;</v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import weatherService from "@/services/weatherService";
const eventbus = require("../../eventbus");

export default {
  data() {
    return {
      city: "",
      cityName: "",
      days: [],
      current: {},
      activeDay: 0,
      intervalHandle: undefined,
      dayDictionary: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      availableDays: [],
      loading: true,
      autoReloadTimer: undefined,
      doSwitchDays: false,
      iconDictionary: {
        "01d": "mdi-white-balance-sunny",
        "02d": "mdi-weather-partly-cloudy",
        "03d": "mdi-weather-cloudy",
        "04d": "mdi-weather-cloudy",
        "09d": "mdi-weather-rainy",
        "10d": "mdi-weather-pouring",
        "11d": "mdi-weather-lightning",
        "13d": "mdi-weather-snowy-heavy",
        "50d": "mdi-weather-fog"
      }
    };
  },
  async created() {
    await this.getWeatherConfig();
    this.getForecast();
    this.getCurrentData();
    var vm = this;
    this.autoReloadTimer = setInterval(async () => {
      eventbus.emit("logevent", "Refresh weather data.");
      await vm.getWeatherConfig();
      vm.getForecast();
      vm.getCurrentData();
    }, 10 * 60 * 1000);
    eventbus.emit("logevent", "Setting refresh timer...");
  },
  methods: {
    async getWeatherConfig() {
      let weatherData = await weatherService.getWeatherSettings();
      weatherData = weatherData.data;
      if (!weatherData.id) {
        console.log("No ID!");
        eventbus.emit("logevent", "No Weather city ID given!");
        return;
      }
      this.city = weatherData.id;
      this.cityName = weatherData.name;
    },
    async getCurrentData() {
      try {
        var response = await weatherService.getCurrentWeatherData(this.city);
        this.current = {
          avg: Math.round(response.data.main.temp),
          wind: Math.round(response.data.wind.speed),
          icon: response.data.weather[0].icon.replace("n", "d")
        };
        console.log(this.current);
      } catch (error) {
        eventbus.emit("logevent", "Error polling current weather: " + error);
        console.log(error);
        this.days = [];
      }
    },
    async getForecast() {
      try {
        var response = await weatherService.get5DayForecast(this.city);
        this.cityName = response.data.city.name;
        var entries = response.data.list;
        entries = entries.map(entry => {
          var date = new Date(entry.dt * 1000);
          entry.dateObj = date;
          return entry;
        });
        var forecastMap = new Map();
        entries.forEach(entry => {
          var key = `${entry.dateObj.getUTCDate()}-${entry.dateObj.getUTCMonth()}-${entry.dateObj.getUTCFullYear()}`;
          if (forecastMap.has(key)) {
            forecastMap.set(key, forecastMap.get(key).concat([entry]));
          } else {
            forecastMap.set(key, [entry]);
          }
        });
        var promises = [];
        for (let entry of forecastMap) {
          promises.push(this.calculateDay(entry[1], entry[0]));
        }
        var days = await Promise.all(promises);
        this.days = days.slice(0, 5);
        for (let day of days) {
          this.availableDays.push(this.dayDictionary[day.weekday]);
        }
        if (this.doSwitchDays) {
          this.setRotation();
        } else {
          this.activeDay = 0;
        }
        this.loading = false;
        console.log(days);
      } catch (error) {
        eventbus.emit("logevent", "Error polling forecast: " + error);
        console.log(error);
        this.days = [];
      }
    },
    setRotation() {
      console.log("Setting interval");
      const vm = this;
      if (this.intervalHandle === undefined || this.intervalHandle === null) {
        this.intervalHandle = setInterval(() => {
          vm.activeDay = (vm.activeDay + 1) % vm.days.length;
          console.log("incremented");
        }, 10000);
      }
    },
    stopTimer() {
      console.log("Stopping interval.");
      clearInterval(this.intervalHandle);
    },
    calculateDay(forecasts, day) {
      return new Promise((resolve, reject) => {
        try {
          // var nameCount = {}
          var conditionCount = {};
          var iconCount = {};
          var avg = 0;
          var min = 1000;
          var max = -300;
          var avgWind = 0;
          for (let forecast of forecasts) {
            // handling min temp
            if (forecast.main.temp_min < min) min = forecast.main.temp_min;
            // handling max temp
            if (forecast.main.temp_max > max) max = forecast.main.temp_max;
            // handling avg temp
            avg = avg + forecast.main.temp;
            // handling conditionCount
            if (conditionCount[forecast.weather[0].description])
              conditionCount[forecast.weather[0].description] =
                conditionCount[forecast.weather[0].description] + 1;
            else conditionCount[forecast.weather[0].description] = 1;
            // handling iconCount
            if (iconCount[forecast.weather[0].icon])
              iconCount[forecast.weather[0].icon] =
                iconCount[forecast.weather[0].icon] + 1;
            else iconCount[forecast.weather[0].icon] = 1;
            // handling avg wind speed
            avgWind = avgWind + forecast.wind.speed;
          }
          // dividing avg through total
          avg = Math.round(avg / forecasts.length);
          avgWind = Math.round(avgWind / forecasts.length);
          // getting most often occurring condition:
          var condition = Object.keys(conditionCount).reduce(
            (prev, current) => {
              return conditionCount[prev] > conditionCount[current]
                ? prev
                : current;
            }
          );
          // getting most often occurring icon:
          var icon = Object.keys(iconCount).reduce((prev, current) => {
            return iconCount[prev] > iconCount[current] ? prev : current;
          });
          var date = new Date();
          var splitDay = day.split("-");
          date.setDate(parseInt(splitDay[0]));
          date.setMonth(parseInt(splitDay[1]));
          date.setUTCFullYear(parseInt(splitDay[2]));
          resolve({
            weekday: date.getDay(),
            date: forecasts[0].dateObj,
            condition: condition,
            icon: icon.replace("n", "d"),
            min: min,
            max: max,
            avg: avg,
            wind: avgWind
          });
        } catch (error) {
          reject(error);
        }
      });
    }
  }
};
</script>
<style scoped>
.weather_day {
  border-style: solid;
  border-width: 2px;
  border-radius: 10px;
  border-color: #555555
}
</style>