const axios = require('axios')
const backendAPI = require('./backendAPI').get()

var api
var oldToken
const apiKey = 'AIzaSyCEvVnswL2OoVFG2QQ3YC2Z0R3lpxYLoxI'

function getApi (token) {
  if (api === undefined || api === null || oldToken !== token) {
    oldToken = token
    api = axios.create({
      baseURL: 'https://www.googleapis.com/calendar/v3/',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
    return api
  } else {
    return api
  }
}

module.exports = {
  listCalendars (token) {
    return getApi(token).get(`users/me/calendarList?key=${apiKey}`)
  },
  getConfiguredCal (token, id) {
    return getApi(token).get(`users/me/calendarList/${id}?key=${apiKey}`)
  },
  getNextEvents (token, id, noOfEvents) {
    let datetime = new Date()
    datetime = datetime.toISOString()
    let end = new Date()
    end.setHours(23, 59, 59, 999)
    end = end.toISOString()
    return getApi(token).get(`calendars/${id}/events?key=${apiKey}&maxResults=${noOfEvents}&singleEvents=true&orderBy=startTime&timeMin=${datetime}`)
  },
  getAuthURL () {
    return backendAPI.get('v1/calendar/googleAuthURL')
  },
  postGoogleCode (code) {
    return backendAPI.post('v1/calendar/googleCode', { code })
  },
  postGoogleID (id) {
    return backendAPI.post('v1/calendar/googleId', { id })
  },
  getCalendarInfo () {
    return backendAPI.get('v1/calendar/info')
  }
}
