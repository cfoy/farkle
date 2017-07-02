<template>
  <div class="farkle-game">
    <player v-for="(player, index) in players"
            :key="player.id"
            v-bind:player="player"
            :active="index === currentPlayer">
    </player>
    <farkle-turn v-on:score="score"></farkle-turn>
  </div>
</template>

<script>
import Player from './Player.vue'
import FarkleTurn from './FarkleTurn.vue'

export default {
  name: 'farkle-game',
  components: {
    Player,
    FarkleTurn
  },

  props: ['players'],

  data () {
    return {
      currentPlayer: 0
    }
  },

  methods: {
    nextPlayer () {
      this.currentPlayer += 1
      this.currentPlayer %= this.players.length
    },
    score (points) {
      this.players[this.currentPlayer].score += points
      this.nextPlayer()
    }
  }
}
</script>
