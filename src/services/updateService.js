const backendAPI = require('./backendAPI').get()

module.exports = {
  getAvailable () {
    return backendAPI.get('v1/updates/available')
  },
  updateNow () {
    return backendAPI.post('v1/updates/updateNow')
  }
}
