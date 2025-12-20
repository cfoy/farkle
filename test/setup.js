import { config } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'

// Suppress Vue production tip
Vue.config.productionTip = false
Vue.config.devtools = false

// Install Vuetify globally for tests
Vue.use(Vuetify)

// Configure Vue Test Utils for Vue 2
config.stubs = {
  transition: false,
  'transition-group': false
}

// Add custom matchers or global test setup here if needed
