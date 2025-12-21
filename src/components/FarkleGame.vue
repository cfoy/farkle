<template>
  <div>
    <div v-if="gameOver">
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <h3>Game Over!</h3>
            </v-card-title>
            <v-card-text>
              <h4 v-if="winner">Winner: {{ winner.name }} with {{ winner.score }} points!</h4>
              <score v-bind:players="players"></score>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
    <div v-else>
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
      totalTurns: 0,
      winningPlayerIndex: null,
      inLastRound: false,
      gameOver: false
    }
  },

  methods: {
    nextPlayer () {
      this.totalTurns += 1
      this.currentPlayer += 1
      this.currentPlayer %= this.players.length
    },
    score (points) {
      if (this.gameOver) {
        return
      }

      this.players[this.currentPlayer].score += points

      if (this.winningPlayerIndex === null && this.players[this.currentPlayer].score >= 10000) {
        this.winningPlayerIndex = this.currentPlayer
        this.inLastRound = true
      }

      this.nextPlayer()

      if (this.inLastRound && this.totalTurns % this.players.length === 0) {
        this.gameOver = true
      }
    },
    findWinnerIndex () {
      let maxScore = -1
      let winnerIndex = -1

      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].score > maxScore) {
          maxScore = this.players[i].score
          winnerIndex = i
        }
      }

      return winnerIndex
    }
  },

  computed: {
    currentPlayerName () {
      return this.players[this.currentPlayer].name
    },
    winner () {
      if (!this.gameOver) {
        return null
      }

      const winnerIndex = this.findWinnerIndex()
      return winnerIndex >= 0 ? this.players[winnerIndex] : null
    }
  }
}
</script>
