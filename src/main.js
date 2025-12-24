// Vue bundled from node_modules (@vue/compat), Vue Router 4 with named imports
import Vue from '@vue/compat'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App'
import Farkle from './components/Farkle'

// Configure Vue 3 compat mode for full Vue 2 compatibility
Vue.configureCompat({
  MODE: 2 // Full Vue 2 compatibility mode
})

// Expose Vue globally for Vuetify 0.x CDN
window.Vue = Vue

// Load and install Vuetify dynamically
function loadVuetify() {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/vuetify@0.12.7/dist/vuetify.min.js'
    script.onload = () => {
      // Vuetify auto-installs on window.Vue when loaded
      setTimeout(resolve, 100)
    }
    script.onerror = () => {
      console.error('Failed to load Vuetify')
      resolve()
    }
    document.head.appendChild(script)
  })
}

// Initialize app after Vuetify loads
async function initApp() {
  await loadVuetify()

  // Create router instance with Vue Router 4 API
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

  // Create Vue instance (Vue 2 constructor style via compat)
  // Router is passed directly - no Vue.use() needed with new Vue()
  new Vue({
    el: '#app',
    router,
    render: h => h(App)
  })
}

// Start the app
initApp()
