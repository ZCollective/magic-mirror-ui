import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#ffffff',
        secondary: '#ffffff',
        accent: '#ffffff',
        error: '#ffffff',
        info: '#ffffff',
        success: '#ffffff',
        warning: '#ffffff',
        background: '#000000'
      },
      light: {
        primary: '#3f51b5',
        secondary: '#00bcd4',
        accent: '#009688',
        error: '#ff5722',
        warning: '#ff9800',
        info: '#03a9f4',
        success: '#8bc34a'
      }
    }
  }
})
