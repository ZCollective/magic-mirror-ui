import axios from 'axios'

export default {
  todaysFact () {
    return axios.get('https://uselessfacts.jsph.pl/today.json?language=de')
  },
  topHeadlines () {
    return axios.get('https://newsapi.org/v2/top-headlines?country=de&apiKey=154f032642ee45189cfb1a6816ac186b')
  }
}
