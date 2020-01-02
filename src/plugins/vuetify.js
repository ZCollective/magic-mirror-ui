import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

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
    },
  },
});
