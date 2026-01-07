import { config } from '@vue/test-utils'

// Configure Vue Test Utils for Vue 3
// Note: This project uses pure Vue 3 (no compat mode)
config.global = config.global || {}

// Create Vuetify component stubs (only for unit tests that need them)
export const vuetifyStubs = {
  // Transitions
  transition: false,
  'transition-group': false,

  // Layout
  'v-app': { template: '<div class="v-app"><slot /></div>' },
  'v-app-bar': { template: '<div class="v-app-bar"><slot /></div>' },
  'v-app-bar-title': { template: '<div class="v-app-bar-title"><slot /></div>' },
  'v-main': { template: '<main class="v-main"><slot /></main>' },
  'v-container': { template: '<div class="v-container"><slot /></div>' },
  'v-row': { template: '<div class="v-row"><slot /></div>' },
  'v-col': { template: '<div class="v-col"><slot /></div>', props: ['cols', 'sm', 'md', 'lg', 'xl'] },

  // Cards
  'v-card': { template: '<div class="v-card"><slot /></div>' },
  'v-card-title': { template: '<div class="v-card-title"><slot /></div>' },
  'v-card-text': { template: '<div class="v-card-text"><slot /></div>' },

  // Buttons
  'v-btn': {
    template: '<button class="v-btn" @click="$emit(\'click\')"><slot /></button>',
    props: ['color', 'variant', 'size', 'block'],
    emits: ['click']
  },

  // Forms
  'v-text-field': {
    template: '<input class="v-text-field" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['label', 'modelValue'],
    emits: ['update:modelValue']
  },

  // Lists (Vuetify 3 slot-based structure with legacy class names for tests)
  'v-list': { template: '<div class="v-list"><slot /></div>' },
  'v-list-subheader': { template: '<div class="v-list-subheader subheader"><slot /></div>' },
  'v-list-item': { template: '<div class="v-list-item list__tile"><slot name="prepend" /><slot /><slot name="append" /></div>' },
  'v-list-item-title': { template: '<div class="v-list-item-title list__tile__title"><slot /></div>' },
  'v-list-item-subtitle': { template: '<div class="v-list-item-subtitle list__tile__sub-title"><slot /></div>' },

  // Misc
  'v-icon': {
    template: '<span class="v-icon"><slot /></span>',
    props: ['onClick']
  },
  'v-chip': {
    template: '<span class="v-chip"><slot /></span>',
    props: ['size', 'color']
  },
  'v-alert': {
    template: '<div class="v-alert"><slot /></div>',
    props: ['type', 'color']
  }
}

// Apply stubs globally only for transitions (never stub these)
config.global.stubs = {
  transition: false,
  'transition-group': false
}

// Add custom matchers or global test setup here if needed
