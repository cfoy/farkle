import { config } from '@vue/test-utils'
import { configureCompat } from 'vue'

// Configure Vue 3 compat mode for Vuetify 0.x
configureCompat({
  MODE: 2 // Full Vue 2 compatibility mode
})

// Configure Vue Test Utils for Vue 3
config.global = config.global || {}

// Create Vuetify component stubs (only for unit tests that need them)
export const vuetifyStubs = {
  // Transitions
  transition: false,
  'transition-group': false,
  // Vuetify components used in the app
  'v-app': { template: '<div class="v-app"><slot /></div>' },
  'v-navigation-drawer': { template: '<div class="v-navigation-drawer"><slot /></div>' },
  'v-toolbar': { template: '<div class="v-toolbar"><slot /></div>' },
  'v-toolbar-title': { template: '<div class="v-toolbar-title"><slot /></div>' },
  'v-container': { template: '<div class="v-container"><slot /></div>' },
  'v-footer': { template: '<div class="v-footer"><slot /></div>' },
  'v-card': { template: '<div class="v-card"><slot /></div>' },
  'v-card-title': { template: '<div class="v-card-title"><slot /></div>' },
  'v-card-text': { template: '<div class="v-card-text"><slot /></div>' },
  'v-btn': {
    template: '<button class="v-btn btn" @click="$emit(\'click\')"><slot /></button>',
    props: ['color', 'flat', 'primary', 'light', 'large', 'block', 'error'],
    emits: ['click']
  },
  'v-text-field': {
    template: '<input class="v-text-field" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['label', 'modelValue'],
    emits: ['update:modelValue']
  },
  'v-layout': { template: '<div class="v-layout"><slot /></div>', props: ['row', 'wrap'] },
  'v-flex': { template: '<div class="v-flex"><slot /></div>', props: ['xs12', 'xs8', 'xs4', 'sm6', 'sm12', 'md4', 'md6', 'lg6'] },
  'v-list': { template: '<div class="v-list"><slot /></div>' },
  'v-subheader': { template: '<div class="v-subheader"><slot /></div>' },
  'v-list-tile': { template: '<div class="v-list-tile list__tile"><slot /></div>', props: ['avatar'] },
  'v-list-tile-avatar': { template: '<div class="v-list-tile-avatar"><slot /></div>' },
  'v-list-tile-content': { template: '<div class="v-list-tile-content list__tile__content"><slot /></div>' },
  'v-list-tile-title': { template: '<div class="v-list-tile-title list__tile__title"><slot /></div>' },
  'v-list-tile-sub-title': { template: '<div class="v-list-tile-sub-title"><slot /></div>' },
  'v-list-tile-action': { template: '<div class="v-list-tile-action list__tile__action"><slot /></div>' },
  'v-icon': {
    template: '<span class="v-icon"><slot /></span>',
    props: ['onClick']
  },
  'v-chip': { template: '<span class="v-chip"><slot /></span>', props: ['small', 'success', 'warning'] },
  'v-alert': { template: '<div class="v-alert"><slot /></div>', props: ['warning', 'success'] }
}

// Apply stubs globally only for transitions (never stub these)
config.global.stubs = {
  transition: false,
  'transition-group': false
}

// Add custom matchers or global test setup here if needed
