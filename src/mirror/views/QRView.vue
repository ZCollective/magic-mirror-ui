<template>
  <v-container fluid style="height: 100%">
    <v-row align="center" justify="center" style="height: 100%">
      <v-col>
        <v-row justify="center" class="mb-10">
          <div class="display-1">Scan the QR code with our app!</div>
        </v-row>
        <v-row justify="center" class="my-10">
          <canvas class="qr-code" id="qrcode"></canvas>
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
const eventbus = require('../../eventbus')
const wifiService = require('../../services/wifiService')

export default {
  name: "QRView",
  data: () => ({
    password: ''
  }),
  async created() {
    console.log('qrcode starting... ')
    try {
      let response = await wifiService.getAP()
      console.log('received wifiup message!')
      var canvas = document.getElementById("qrcode");
      console.log(response.data)
      var qrString = `WIFI:S:Mirror;T:WPA;P:${response.data};;`;
      this.password = response.data
      QRCode.toCanvas(
        canvas,
        qrString,
        {
          errorCorrectionLevel: "M",
          scale: 10,
          color: {
            dark: "#00000000",
            light: "#ffffffff"
          },
          margin: 18
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
    } catch (error) {
      console.log(error)
      eventbus.emit('snackbar', 'Could not get QR Code!')
    }
  }
}
</script>
<style scoped>
.qr-code {
  border-radius:100%;
}
</style>
