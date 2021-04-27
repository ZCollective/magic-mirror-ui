<template>
  <v-app
    v-if="isPi"
    :style="{background: $vuetify.theme.themes.dark.background}"
    style="height: 100%"
  >
    <v-main v-show="!showLoader">
      <router-view></router-view>
    </v-main>
    <v-main v-show="showLoader">
      <Loader :text="loaderText" />
    </v-main>
    <v-footer v-if="showDebug" color="black" app>
      <v-col>
        <v-row justify="center" v-if="updateAvailable" class="title">An Update is available!</v-row>
        <DebugInfo />
      </v-col>
    </v-footer>
  </v-app>
  <v-app v-else>
    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click.stop="showDrawer = !showDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{currentRoute}}</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer clipped app v-model="showDrawer" color="grey lighten-1">
      <NavDrawer :dev="showDebug" />
    </v-navigation-drawer>
    <v-main app>
      <v-overlay v-show="showLoader">
        <ConfigLoader :text="loaderText"></ConfigLoader>
      </v-overlay>
      <router-view></router-view>
    </v-main>
    <v-snackbar v-model="showSnackbar">
      {{ snackBarText }}
      <v-btn color="white" text @click="showSnackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>
<script>
const deviceDetection = require("mobile-device-detect");
const eventbus = require("./eventbus");
const sendEvents = require("../lib/mirror_shared_code/socketEvents");
const wifiService = require('./services/wifiService')

import Loader from "./common/Loader";
import ConfigLoader from "./common/ConfigLoader"
import DebugInfo from "./common/DebugInfo";
import NavDrawer from "./configuration/components/NavDrawer";

export default {
  name: "App",
  components: {
    Loader,
    DebugInfo,
    NavDrawer,
    ConfigLoader
  },
  data: () => ({
    showLoader: true,
    showContent: false,
    showQR: false,
    loaderText: "Starting...",
    password: "",
    showSnackbar: false,
    snackBarText: "",
    showDebug: process.env.VUE_APP_SHOW_DEBUG === "true",
    socketReady: false,
    updateAvailable: false,
    isPi: false,
    showDrawer: false
  }),
  created() {
    //saving this for later use
    const vm = this;

    //defining loader events
    eventbus.on("load", text => {
      eventbus.emit("logevent", "got load event!");
      vm.loaderText = text;
      vm.showLoader = true;
    });
    eventbus.on("stopload", () => {
      eventbus.emit("logevent", "got stopload event");
      vm.showLoader = false;
    });
    eventbus.on("snackbar", text => {
      vm.snackBarText = text;
      vm.showSnackbar = true;
    });

    //setting loader as startup dash. -> using eventbus to deduplicate code
    eventbus.emit("load", "Starting...");

    console.log(deviceDetection.deviceDetect()); 
    // If we are on a mobile device, we start config
    if (
      deviceDetection.isMobile //|| deviceDetection.deviceDetect().osVersion === 'x86_64'
    ) {
      this.configDevice();
    } else {
      this.piDevice();
    }
  },
  methods: {
    //Method to run if we are on the pi
    piDevice() {
      this.isPi = true;

      try {
        //we setup the listener for messages from backend.
        //we only listen for messages that are relevant.
        this.$options.sockets.onmessage = data => {
          const message = JSON.parse(data.data);
          switch (message.event) {
            case sendEvents.mirror_frontend.signal_frontend_ready.responses
              .first_start:
              eventbus.emit(
                "logevent",
                "first start was detected. Pushing to qrcode."
              );
              // Firststart is detected, so we continue with QR code
              this.$router.push("qrcode");
              break;
            case sendEvents.mirror_frontend.signal_frontend_ready.responses
              .show_content:
              // Backend says we should show the content
              this.$router.push("content");
              break;
            case sendEvents.mirror_frontend.signal_frontend_ready.responses
              .reboot:
              //Reboot signal, displaying reboot dash
              eventbus.emit("load", "Rebooting...");
              break;
            case sendEvents.mirror_frontend.signal_frontend_ready.responses
              .update_available:
              // Update available signal. Showing in Footer
              this.updateAvailable = true;
              break;
            default:
              //We dont need to care about this message in App.vue. Instead we are forwarding it through
              // the global event bus
              eventbus.emit(message.event, message.data || "");
              break;
          }
        };
      } catch (error) {
        console.log(error);
        this.snackBarText = "Failed to get Basic Info";
        this.showSnackbar = true;
      }

      //As soon as the socket opens,we send ready signal to backend
      this.$socket.onopen = () => {
        this.$socket.sendObj({
          event: sendEvents.mirror_frontend.signal_frontend_ready.event
        });
        this.socketReady = true;
      };

      this.$socket.onclose = () => {
        this.socketReady = false;
      };

      eventbus.on("socketReady", () => {
        console.log("Received socketReady event");
        eventbus.emit(
          this.socketReady ? "socketReadyConfirm" : "socketReadyDeny"
        );
      });
    },
    async configDevice() {
      try {
        this.$vuetify.theme.dark = false
        let styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.id = "config_style_overflow_y";
        document.getElementsByTagName("head")[0].appendChild(styleElement);
        styleElement.appendChild(
          document.createTextNode("html { overflow-y: scroll !important; }")
        )
        console.log("I am here for config!")

        let response = await wifiService.getConnectivity()
        console.log(response.data)
        if (response.data) {
          console.log("We have internet connectivity");
          // We should go to normal config.
          this.$router.push("config");
        } else {
          console.log('We do not yet have internet!')
          // Backend says we should show the wifi config.
          this.$router.push("/config/wifi");
        }
      } catch (error) {
        console.log(error);
        this.snackBarText = "Failed to get Basic Info";
        this.showSnackbar = true;
      }
    }
  },
  computed: {
    currentRoute () {
      return this.$route.name
    }
  }
};
</script>
<style>
html {
  overflow-y: hidden !important;
}
</style>
