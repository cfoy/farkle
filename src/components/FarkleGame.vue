<template>
  <div>
    <tie-breaker
      v-if="gameOver && inTieBreaker"
      v-bind:players="players"
      v-bind:tied-player-indices="tiedPlayerIndices"
      v-bind:highest-score="highestScore"
      v-on:select-winner="selectTieBreakerWinner">
    </tie-breaker>
    <game-over
      v-else-if="gameOver"
      v-bind:players="players"
      v-bind:winner="winner">
    </game-over>
    <div v-else>
      <current-player-header v-bind:player-name="currentPlayerName"></current-player-header>
      <active-game
        v-bind:current-player="players[currentPlayer]"
        v-bind:current-player-name="currentPlayerName"
        v-bind:players="players"
        v-on:score="score">
      </active-game>
    </div>
  </div>
</template>

<script>
import CurrentPlayerHeader from './CurrentPlayerHeader.vue'
import TieBreaker from './TieBreaker.vue'
import GameOver from './GameOver.vue'
import ActiveGame from './ActiveGame.vue'

export default {
  name: 'farkle-game',
  components: {
    CurrentPlayerHeader,
    TieBreaker,
    GameOver,
    ActiveGame
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

      // Set onBoard status when player banks 500+ points for the first time
      if (!this.players[this.currentPlayer].onBoard && points >= 500) {
        this.players[this.currentPlayer].onBoard = true
      }

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
