<template>
<v-card>
  <v-img  v-for="link in linkList" :key="link" :src="link">
  </v-img>
</v-card>
</template>
<script>
import comicService from '@/services/comicService'

export default {
  data () {
    return {
      linkList: []
    }
  },
  created () {
    this.getXKCD()
  },
  methods: {
    async getXKCD () {
      try {
        let response = await comicService.xkcd()
        console.log(response)
        this.linkList.push(response.data.img)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>