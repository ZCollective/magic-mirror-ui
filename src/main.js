import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import VueNativeSock from 'vue-native-websocket'
Vue.config.productionTip = false
Vue.prototype.$eventbus = new Vue(); // Global event bus
Vue.use(VueNativeSock, `ws://${process.env.VUE_APP_HOST || window.location.hostname}:11882`, 
  { format: 'json',
    reconnection: true, // (Boolean) whether to reconnect automatically (false)
    reconnectionDelay: 1000, // (Number) how long to initially wait before attempting a new (1000)
  })

  new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
