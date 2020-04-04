<template>
  <v-container fluid style="height: 100%">
    <v-row align="center" justify="center" style="height: 100%">
      <v-col>
        <v-row justify="center">
          <v-progress-circular indeterminate width="9" size="300" color="white">
            <div class="display-1 loader-text">{{ text }}</div>
          </v-progress-circular>
        </v-row>
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
.v-progress-circular--indeterminate svg {
  -webkit-animation: progress-circular-rotate 7s linear infinite !important;
  animation: progress-circular-rotate 7s linear infinite !important;
  -webkit-transform-origin: center center;
  transform-origin: center center;
  -webkit-transition: all 3s ease-in-out !important;
  transition: all 3s ease-in-out !important;
}
.v-progress-circular--indeterminate .v-progress-circular__overlay {
  -webkit-animation: progress-circular-dash 7s ease-in-out infinite !important;
  animation: progress-circular-dash 7s ease-in-out infinite !important;
  stroke-linecap: round;
  stroke-dasharray: 80, 200;
  stroke-dashoffset: 0px;
}
.loader-text {
  animation: pulse 6s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
