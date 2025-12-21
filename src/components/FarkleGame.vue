<template>
  <div>
    <h5>Current Player: {{ currentPlayerName }}</h5>
    </v-card-title>
    <v-layout row wrap>
      <v-flex xs12 sm12 md6 lg6>
        <v-card>
          <v-card-text>
            <farkle-turn v-on:score="score"></farkle-turn>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md6 lg6>
        <v-card>
          <v-card-text>
            <score v-bind:players="players"></score>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
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
      currentPlayer: 0,
      totalTurns: 0
    }
  },

  methods: {
    nextPlayer () {
      this.totalTurns += 1
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
