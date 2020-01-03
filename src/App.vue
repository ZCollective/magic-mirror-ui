<template>
  <v-app :style="{background: $vuetify.theme.themes.dark.background}" style="height: 100%">
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
html { overflow-y: auto !important}
</style>
