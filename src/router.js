import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/content',
      name: 'content',
      component: () => import(/* webpackChunkName: "content" */ './views/Main.vue')
    },
    {
      path: '/config',
      name: 'config',
      component: () => import(/* webpackChunkName: "config" */ './views/ConfigMain.vue')
    },
    {
      path: '/wifiConfig',
      name: 'wificonfig',
      component: () => import(/* webpackChunkName: "wificonfig" */ './views/WifiConfig.vue')
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: () => import(/* webpackChunkName: "qrcode" */ './views/QRView.vue')
    }
  ]
})
