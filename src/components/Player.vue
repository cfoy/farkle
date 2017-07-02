<template>
  <div class="player">
    <h1>{{ player.name }}</h1>
    <h3>Score: {{ player.score }}</h3>
  </div>
</template>

<script>
  export default {
    props: ['player'],
    name: 'player'
  }
</script>

<style >
  [active=true] h1 {
    color: green;
  }
</style>
