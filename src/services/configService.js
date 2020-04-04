import axios from 'axios'

var api

function getApi() {
  if (api === undefined || api === null) {
    api = axios.create({
      baseURL: `http://${window.location.hostname}:11882/`,
    })
    return api
  } else {
    return api
  }
}

export default {
    testConnection () {
        return getApi().get('echo')
    }
}

