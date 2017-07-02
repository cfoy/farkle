<template>
  <div>
    <h3>Current Player: {{ currentPlayerName }}</h3>
    <farkle-turn v-on:score="score"></farkle-turn>
    <score v-bind:players="players"></score>
  </div>
</template>

<script>
import Score from './Score.vue'
import FarkleTurn from './FarkleTurn.vue'

export default {
  name: 'farkle-game',
  components: {
    Score,
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
  },

  computed: {
    currentPlayerName () {
      return this.players[this.currentPlayer].name
    }
  }
}
</script>
