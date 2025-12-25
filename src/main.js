// Vue 3 with compat mode, Vue Router 4 with named imports
import { createApp, configureCompat } from '@vue/compat'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App'
import Farkle from './components/Farkle'

// Vuetify 3 imports
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// Configure Vue 3 compat mode for full Vue 2 compatibility
configureCompat({
  MODE: 2
})

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
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

// Use plugins
app.use(router)
app.use(vuetify)

// Mount the app
app.mount('#app')
