import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/content',
      name: 'content',
      component: () => import(/* webpackChunkName: "content" */ './mirror/views/Main.vue')
    },
    {
      path: '/config',
      name: 'Configuration',
      component: () => import(/* webpackChunkName: "config" */ './configuration/views/ConfigMain.vue'),
      children: [
        {
          path: '/wifi',
          name: 'Wifi Configuration',
          component: () => import(/* webpackChunkName: "wificonfig" */ './configuration/views/WifiConfig.vue')
        },
        {
          path: '/calendar',
          name: 'Calendar Settings',
          component: () => import(/* webpackChunkName: "calendarconfig" */ './configuration/views/CalendarConfig.vue')
        },
        {
          path: '/dev',
          name: 'devconfig',
          component: () => import(/* webpackChunkName: "devconfig" */ './configuration/views/DevConfig.vue')
        },
        {
          path: '/general',
          name: 'General Settings',
          component: () => import(/* webpackChunkName: "generalconfig" */ './configuration/views/GeneralConfig.vue')
        },
        {
          path: '/update',
          name: 'Updates',
          component: () => import(/* webpackChunkName: "updateconfig" */ './configuration/views/UpdateConfig.vue')
        }
      ]
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: () => import(/* webpackChunkName: "qrcode" */ './mirror/views/QRView.vue')
    }
  ]
})
