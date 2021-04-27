const backendAPI = require('./backendAPI').get()

module.exports = {
  getName () {
    return backendAPI.get('v1/device/name')
  },
  setName (name) {
    return backendAPI.post('v1/device/name', { name })
  },
  getInfo () {
    return backendAPI.get('v1/device/info')
  }
}
