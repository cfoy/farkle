// Vue 3 with compat mode, Vue Router 4 with named imports
import { createApp, configureCompat } from '@vue/compat'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App'
import Farkle from './components/Farkle'

// Configure Vue 3 compat mode for full Vue 2 compatibility
configureCompat({
  MODE: 2 // Full Vue 2 compatibility mode
})

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

// Create Vue 3 app instance
const app = createApp(App)

// Use router
app.use(router)

// Load Vuetify from CDN before mounting
function loadVuetify() {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/vuetify@0.12.7/dist/vuetify.min.js'
    script.onload = () => {
      // Try to manually install Vuetify on the app instance if it exists as a global
      if (window.Vuetify) {
        try {
          // Vuetify 0.x expects Vue.use(), try to make it work with app.use()
          app.use(window.Vuetify)
        } catch (e) {
          console.warn('Could not install Vuetify as plugin:', e)
        }
      }
      setTimeout(resolve, 100)
    }
    script.onerror = () => {
      console.error('Failed to load Vuetify')
      resolve()
    }
    document.head.appendChild(script)
  })
}

// Initialize app
async function initApp() {
  await loadVuetify()

  // Mount the app
  app.mount('#app')
}

initApp()
