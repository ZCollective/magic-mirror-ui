<template>
  <v-container fluid style="height: 100%">
    <v-row align="center" justify="center" style="height: 100%">
      <v-col>
        <v-row justify="center">
          <v-progress-circular indeterminate width="6" size="100" color="white">
          </v-progress-circular>
        </v-row>
        <div class="title loader-text">{{ text }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "Loader",
  props: {
    text: String
  },
  data: () => ({}),
};
</script>
<style>

</style>
