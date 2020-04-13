<template>
  <v-container fluid style="height: 100%">
    <v-row align="center" justify="center" style="height: 100%">
      <v-col>
        <v-row justify="center" class="mb-10">
          <div class="display-1">Scan the QR code with our app!</div>
        </v-row>
        <v-row justify="center" class="my-10">
          <canvas id="qrcode"></canvas>
        </v-row>
        <v-row justify="center" class="mt-10">
          <div class="display-1">
            Network: Mirror
            <br />
            Password: {{ password }}
          </div>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const QRCode = require("qrcode");
const eventbus = require('../eventbus')
const sendEvents = require('../../lib/mirror_shared_code/socketEvents')


export default {
  name: "QRView",
  data: () => ({
    password: ''
  }),
  created() {
    console.log('qrcode starting... ')
    //saving this for later use
    const vm = this

    //Listening for wifiup message from backend
    eventbus.on(sendEvents.mirror_frontend.signal_start_ap.responses.ap_started, message => {
      console.log('received wifiup message!')
      var canvas = document.getElementById("qrcode");
      console.log(message)
      var qrString = `WIFI:S:Mirror;T:WPA;P:${message};;`;
      vm.password = message
      QRCode.toCanvas(
        canvas,
        qrString,
        {
          errorCorrectionLevel: "M",
          scale: 10,
          color: {
            dark: "#00000000",
            light: "#ffffffff"
          }
        },
        function(error) {
          if (error) {
            console.error(error);
            //in the future we must show a reboot prompt!
          } else {
            console.log("created QR Code!")
            eventbus.emit('stopload')
          }
        }
      )
    })

    // send startwifi signal to backend
    this.$socket.sendObj({ event: sendEvents.mirror_frontend.signal_start_ap.event });
  }
}
</script>
