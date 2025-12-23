// Vue and Vue Router bundled from node_modules (@vue/compat)
import * as Vue from 'vue'
import { createApp, configureCompat } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App'
import Farkle from './components/Farkle'

// Expose Vue globally for Vuetify 0.x CDN compatibility
window.Vue = Vue

// Configure Vue 3 compat mode for Vuetify 0.x
configureCompat({
  MODE: 2 // Full Vue 2 compatibility mode
})

// Load and install Vuetify dynamically
function loadVuetify() {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/vuetify@0.12.7/dist/vuetify.min.js'
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

// Initialize app after Vuetify loads
async function initApp() {
  await loadVuetify()

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

  // Create app
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
}

// Start the app
initApp()
