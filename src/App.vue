<template>
  <v-app :style="{background: $vuetify.theme.themes.dark.background}">
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  created() {
  },
};
</script>
<style>
</style>
