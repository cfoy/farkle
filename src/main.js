// Vue and Vue Router are loaded globally via CDN in index.html
/* global Vue, VueRouter */
import App from './App'
import Farkle from './components/Farkle'

// Vue 3 API
const { createApp } = Vue
const { createRouter, createWebHashHistory } = VueRouter

// Create router instance
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Farkle',
      component: Farkle
    }
  ]
})

// Create and mount app
const app = createApp(App)
app.use(router)
app.mount('#app')
