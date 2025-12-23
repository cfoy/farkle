// Vue, Vue Router, and Vuetify are loaded globally via CDN in index.html
/* global Vue, VueRouter */
import App from './App'
import Farkle from './components/Farkle'

Vue.config.productionTip = false

// Create router instance
const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Farkle',
      component: Farkle
    }
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
