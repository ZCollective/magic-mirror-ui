import axios from 'axios'

var api
const apiKey = '6515baab06a3123089d0183fd865be38'

function getApi() {
  if (api === undefined || api === null) {
    api = axios.create({
      baseURL: 'https://api.openweathermap.org/data/2.5/',
    })
    return api
  } else {
    return api
  }
}

export default {
  get5DayForecast(cityID) {
    return getApi().get(`forecast?id=${cityID}&APPID=${apiKey}&units=metric&lang=de`)
  }
}

