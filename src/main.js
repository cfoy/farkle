// Vue and Vue Router bundled from node_modules (@vue/compat)
// Vuetify 0.x loaded via CDN
/* global Vuetify */
import { createApp, configureCompat } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App'
import Farkle from './components/Farkle'

// Configure Vue 3 compat mode for Vuetify 0.x
configureCompat({
  MODE: 2 // Full Vue 2 compatibility mode
})

// Install Vuetify from CDN global
const app = createApp(App)
if (window.Vuetify) {
  app.use(window.Vuetify)
}

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

// Use router and mount
app.use(router)
app.mount('#app')
