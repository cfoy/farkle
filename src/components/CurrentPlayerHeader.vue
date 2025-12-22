<template>
  <h5>Current Player: {{ playerName }}</h5>
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
