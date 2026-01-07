<template>
  <div>
    <tie-breaker
      v-if="gameOver && inTieBreaker"
      v-bind:players="players"
      v-bind:tied-player-indices="tiedPlayerIndices"
      v-bind:highest-score="highestScore"
      v-bind:next-starter-index="nextStarterIndexAfterGame"
      v-on:select-winner="selectTieBreakerWinner">
    </tie-breaker>
    <game-over
      v-else-if="gameOver"
      v-bind:players="players"
      v-bind:winner="winner"
      v-bind:next-starter-index="nextStarterIndexAfterGame">
    </game-over>
    <div v-else>
      <current-player-header v-bind:player-name="currentPlayerName"></current-player-header>
      <active-game
        v-bind:current-player="players[currentPlayer]"
        v-bind:current-player-name="currentPlayerName"
        v-bind:players="players"
        v-bind:next-starter-index="startingPlayerIndex"
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

  props: {
    players: {
      type: Array,
      required: true
    },
    startingPlayerIndex: {
      type: Number,
      default: null
    }
  },

  data () {
    return {
      currentPlayer: 0,
      totalTurns: 0,
      winningPlayerIndex: null,
      inLastRound: false,
      gameOver: false,
      inTieBreaker: false,
      tiedPlayerIndices: [],
      selectedWinner: null,
      winnerEmitted: false
    }
  },

  created () {
    // Initialize currentPlayer based on startingPlayerIndex if provided
    if (this.startingPlayerIndex !== null &&
        this.startingPlayerIndex >= 0 &&
        this.startingPlayerIndex < this.players.length) {
      this.currentPlayer = this.startingPlayerIndex
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
        // If no tie-breaker, emit the winner
        if (!this.inTieBreaker && !this.winnerEmitted) {
          this.emitWinner()
        }
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
    findLoserIndex () {
      if (this.players.length === 0) {
        return -1
      }

      let minScore = this.players[0].score
      let loserIndex = 0

      for (let i = 1; i < this.players.length; i++) {
        if (this.players[i].score < minScore) {
          minScore = this.players[i].score
          loserIndex = i
        }
      }

      return loserIndex
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
      // Emit winner after tie-breaker selection
      if (!this.winnerEmitted) {
        this.emitWinner()
      }
    },
    emitWinner () {
      const winnerPlayer = this.winner
      const loserPlayer = this.loser
      if (winnerPlayer && !this.winnerEmitted) {
        this.winnerEmitted = true
        this.$emit('game-end', { winner: winnerPlayer, loser: loserPlayer })
      }
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
    loser () {
      if (!this.gameOver) {
        return null
      }

      // If in tie-breaker mode, don't determine loser yet
      if (this.inTieBreaker) {
        return null
      }

      const loserIndex = this.findLoserIndex()
      return loserIndex >= 0 ? this.players[loserIndex] : null
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
    },
    nextStarterIndexAfterGame () {
      // Show the loser as next starter when game is over
      if (!this.gameOver) {
        return null
      }

      const loserIndex = this.findLoserIndex()
      return loserIndex >= 0 ? loserIndex : null
    }
  }
}
</script>
