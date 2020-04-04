<template>
    <v-card color="#000000" class="mt-7">
      <v-carousel hide-delimiters hide-delimiter-background continuous :show-arrows="false" interval="20000" cycle>
        <v-carousel-item transition="fade-transition">
          <v-row justify="center" class="display-2 mb-10">
            Fakt des Tages
          </v-row>
          <v-row class="display-1 text-center mx-auto">
            {{fact.text}}
          </v-row>
        </v-carousel-item>
        <v-carousel-item v-for="headline in headlines" :key="headline.title" class="text-left px-1"  transition="fade-transition">
          <v-row justify="center" class="display-1 px-4">
            {{headline.title}}
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-card>  
</template>
<script>
import factService from "@/services/factService";
const eventbus = require('../eventbus')

export default {
  data () {
    return {
      fact: {},
      headlines: [],
      refreshHandle: null
    }
  },
  created () {
    this.loadFactAndNews()
    var vm = this
    this.refreshHandle = setInterval(vm.loadFactAndNews, 60 * 60 * 1000 /* 60 minutes */)
  },
  methods: {
    async loadFactAndNews () {
      try {
        let response = await factService.todaysFact()
        this.fact = response.data
        response = await factService.topHeadlines()
        this.headlines = response.data.articles.slice(0,5)
      } catch (error) {
        eventbus.emit('logevent', 'Error getting fact/news: ' + error)
        console.log(error)
      }
    }
  }
}
</script>