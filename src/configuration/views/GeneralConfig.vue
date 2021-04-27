<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>Weather Widget</v-card-title>
          <v-card-text>
            <v-col>
              <v-autocomplete
                v-model="selectedCountry"
                :items="countries"
                item-text="name"
                item-value="name"
                label="Select Countrycode"
                placeholder="Start typing to Search"
              ></v-autocomplete>
              <v-autocomplete
                v-model="selected"
                :items="citiesToSearch"
                item-text="name"
                item-value="id"
                label="Select City"
                placeholder="Start typing to Search"
              ></v-autocomplete>
              <v-btn block text @click="saveWeatherData">Save</v-btn>
            </v-col>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import cityList from "../../assets/current.city.list.min.json";
import weatherService from "@/services/weatherService";
const eventbus = require('../../eventbus')

export default {
  data: () => {
    return {
      selected: {},
      selectedCountry: "",
      originalCountry: "",
      originalSelected: 0
    };
  },
  computed: {
    allowSave: function() {
      return (
        this.originalSelected !== this.selected.id ||
        this.originalCountry !== this.country
      );
    },
    countries: () => {
      return Array.from(new Set(cityList.map(e => e.country))).map(c => {
        return { name: c };
      });
    },
    citiesToSearch: function() {
      let cities = cityList.filter(e => e.country === this.selectedCountry);
      // Changing name to potential language
      const selectedCountryLower = this.selectedCountry.toLowerCase();
      return cities
        .map(city => {
          if (city.langs) {
            let lang = city.langs.filter(l =>
              Object.keys(l).includes(selectedCountryLower)
            );
            if (lang.length > 0) {
              lang = lang[0];
              city.name = lang[selectedCountryLower];
            }
          }
          return city;
        })
        .reverse();
    }
  },
  async created() {
    try {
      let weatherData = await weatherService.getWeatherSettings();
      weatherData = weatherData.data
      if (!weatherData.country || !weatherData.city || !weatherData.id) {
        console.log("Weather is not saved yet!");
      } else {
        this.originalCountry = weatherData.country;
        this.selectedCountry = weatherData.country;
        this.originalSelected = weatherData.id;
        this.selected = weatherData.id;
      }
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async saveWeatherData () {
      try {
        let object = this.citiesToSearch.filter(c => c.id === this.selected)
        if (!object.length > 0) {
          throw new Error('No city found matching id: ' + this.selected)
        }
        object = object[0]
        await weatherService.setWeatherSettings(this.selectedCountry, object.name, this.selected)
        eventbus.emit('snackbar', 'Saved Weather Settings!')
      } catch (error) {
        console.log(error)
        eventbus.emit('snackbar', 'Could not save Weather Settings!')
      }
    }
  }
};
</script>