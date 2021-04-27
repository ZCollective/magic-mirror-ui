const backendAPI = require('./backendAPI').get()

module.exports = {
  getNetworks () {
    return backendAPI.get('v1/wifi/networks')
  },
  getAP () {
    return backendAPI.get('v1/wifi/ap')
  },
  connect (ssid, password) {
    return backendAPI.post('v1/wifi/connect', { ssid, password })
  },
  confirmConfig () {
    return backendAPI.post('v1/wifi/confirmConfig')
  },
  getConnectivity () {
    return backendAPI.get('v1/wifi/connectivity')
  }
}
