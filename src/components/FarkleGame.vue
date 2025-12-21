<template>
  <div>
    <div v-if="gameOver && inTieBreaker">
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <h3>It's a Tie!</h3>
            </v-card-title>
            <v-card-text>
              <p>The following players are tied with {{ highestScore }} points:</p>
              <p><strong>Roll a die to determine the winner!</strong></p>
              <p>Each tied player should roll one die. The player with the highest roll wins.</p>
              <p>If there's still a tie, re-roll until there's a winner.</p>
              <p>Click the button for the player who rolled the highest:</p>

              <v-layout row wrap>
                <v-flex xs12 sm6 md4 v-for="index in tiedPlayerIndices" v-bind:key="index">
                  <v-btn
                    primary
                    light
                    large
                    block
                    v-on:click.native="selectTieBreakerWinner(index)">
                    {{ players[index].name }} - {{ players[index].score }} points
                  </v-btn>
                </v-flex>
              </v-layout>

              <score v-bind:players="players"></score>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
    <div v-else-if="gameOver">
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
      gameOver: false,
      inTieBreaker: false,
      tiedPlayerIndices: [],
      selectedWinner: null
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
        this.checkForTie()
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
    },
    findTiedPlayers () {
      let maxScore = -1

      // Find maximum score
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].score > maxScore) {
          maxScore = this.players[i].score
        }
      }

      // Find all players with that score
      const tiedIndices = []
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].score === maxScore) {
          tiedIndices.push(i)
        }
      }

      return tiedIndices
    },
    checkForTie () {
      const tiedIndices = this.findTiedPlayers()
      if (tiedIndices.length > 1) {
        this.inTieBreaker = true
        this.tiedPlayerIndices = tiedIndices
      }
    },
    selectTieBreakerWinner (playerIndex) {
      this.inTieBreaker = false
      this.tiedPlayerIndices = []
      this.selectedWinner = playerIndex
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

      // If in tie-breaker mode, don't show winner yet
      if (this.inTieBreaker) {
        return null
      }

      // If user selected winner from tie-breaker, use that
      if (this.selectedWinner !== null) {
        return this.players[this.selectedWinner]
      }

      // Otherwise use normal logic
      const winnerIndex = this.findWinnerIndex()
      return winnerIndex >= 0 ? this.players[winnerIndex] : null
    },
    highestScore () {
      if (this.players.length === 0) {
        return 0
      }

      let maxScore = this.players[0].score
      for (let i = 1; i < this.players.length; i++) {
        if (this.players[i].score > maxScore) {
          maxScore = this.players[i].score
        }
      }
      return maxScore
    }
  }
}
</script>
