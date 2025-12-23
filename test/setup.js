import { config } from '@vue/test-utils'

// Configure Vue Test Utils for Vue 3
config.global = config.global || {}

// Stub Vuetify components globally since Vuetify 0.x is not Vue 3 compatible
config.global.stubs = {
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
    template: '<button class="v-btn btn"><slot /></button>',
    props: ['color', 'flat', 'primary', 'light', 'large', 'block']
  },
  'v-text-field': {
    template: '<input class="v-text-field" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['label', 'modelValue']
  },
  'v-layout': { template: '<div class="v-layout"><slot /></div>', props: ['row', 'wrap'] },
  'v-flex': { template: '<div class="v-flex"><slot /></div>', props: ['xs12', 'sm6', 'md4'] },
  'v-list': { template: '<div class="v-list"><slot /></div>' },
  'v-list-tile': { template: '<div class="v-list-tile list__tile"><slot /></div>' },
  'v-list-tile-content': { template: '<div class="v-list-tile-content list__tile__content"><slot /></div>' },
  'v-list-tile-title': { template: '<div class="v-list-tile-title list__tile__title"><slot /></div>' },
  'v-list-tile-sub-title': { template: '<div class="v-list-tile-sub-title"><slot /></div>' },
  'v-list-tile-action': { template: '<div class="v-list-tile-action list__tile__action"><slot /></div>' }
}

// Add custom matchers or global test setup here if needed
