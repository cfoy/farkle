<template>
  <h3>Current Player: {{ playerName }}</h3>
</template>

<script>
export default {
  name: 'current-player-header',
  props: {
    playerName: {
      type: String,
      required: true
    }
  }
}
</script>
