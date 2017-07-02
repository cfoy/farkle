<template>
  <div class="player-list">
    <h2>Players</h2>
    <ul>
      <li v-for="player in players">
        {{ player.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['players']
}
</script>
