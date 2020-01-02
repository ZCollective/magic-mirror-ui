import axios from 'axios'

export default {
  xkcd() {
    return axios.get(`https://cors-anywhere.herokuapp.com/https://xkcd.com/info.0.json`)
  }
}