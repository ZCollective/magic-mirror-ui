const axios = require('axios')
var api
module.exports = {
  get () {
    if (api === undefined || api === null) {
      api = axios.create({
        baseURL: `http://${process.env.VUE_APP_HOST || window.location.hostname}:${process.env.VUE_APP_BACKEND_PORT || '80'}/`
      })
      return api
    } else {
      return api
    }
  }
}
