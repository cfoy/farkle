<template>
  <div v-if="started">
      <farkle-game
        :key="gameKey"
        v-bind:players="players"
        v-bind:starting-player-index="nextGameStartingPlayerIndex"
        v-on:game-end="handleGameEnd"
        v-on:play-again="playAgain"
        v-on:change-players="restartGame">
      </farkle-game>
      <v-card v-if="!gameOver" class="mt-8">
        <v-card-text class="text-center">
          <v-divider class="mb-4"></v-divider>
          <v-btn color="warning" variant="outlined" size="large" @click="restartGame">
            Restart Game
          </v-btn>
        </v-card-text>
      </v-card>
  </div>
  <div v-else>
    <v-card>
      <v-card-text>
        <create-player v-on:create-player="createPlayer"></create-player>
      </v-card-text>
      <v-card-text>
        <player-list v-bind:players="players"></player-list>
        <v-btn color="primary" @click="startGame">Start Game</v-btn>
        <v-btn variant="text" @click="resetWinStatistics">Reset Win Statistics</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import PlayerList from './PlayerList.vue'
import CreatePlayer from './CreatePlayer.vue'
import FarkleGame from './FarkleGame.vue'

export default {
  name: 'farkle',
  components: {
    PlayerList,
    CreatePlayer,
    FarkleGame
  },
  data () {
    return {
      players: [],
      started: false,
      nextGameStartingPlayerIndex: null,
      gameKey: 0,
      gameOver: false
    }
  },

  methods: {
    createPlayer (player) {
      this.players.push(player)
    },
    startGame () {
      if (this.players.length >= 2) {
        this.started = true
        this.gameOver = false
      }
    },
    restartGame () {
      this.players.forEach(function (player) {
        player.score = 0
        player.onBoard = false
      })
      this.started = false
      this.nextGameStartingPlayerIndex = null
      this.gameOver = false
    },
    playAgain (loserIndex) {
      // Reset player scores and onBoard status
      this.players.forEach(function (player) {
        player.score = 0
        player.onBoard = false
      })

      // Reorder players array to put loser at the front
      if (loserIndex !== null && loserIndex >= 0 && loserIndex < this.players.length) {
        // Create reordered array: loser + everyone after + everyone before loser
        const reordered = [
          ...this.players.slice(loserIndex),
          ...this.players.slice(0, loserIndex)
        ]
        // Replace players array contents while maintaining reactivity
        this.players.splice(0, this.players.length, ...reordered)
        // After reordering, loser is at index 0
        this.nextGameStartingPlayerIndex = 0
      } else {
        // Fallback if loserIndex is invalid
        this.nextGameStartingPlayerIndex = loserIndex
      }

      // Reset game over state
      this.gameOver = false
      // Force FarkleGame to remount with new game state
      this.gameKey += 1
    },
    handleGameEnd (gameResult) {
      // Handle both old format (direct winner object) and new format ({ winner, loser })
      const winner = gameResult.winner || gameResult
      const loser = gameResult.loser || null

      // Set game over state
      this.gameOver = true

      // Increment the winner's wins count
      if (winner && winner.wins !== undefined) {
        winner.wins += 1
        // Save to localStorage
        this.saveWinsToLocalStorage()
      }

      // Store the loser's index for next game's starting player
      if (loser) {
        const loserIndex = this.players.findIndex(p => p === loser)
        if (loserIndex !== -1) {
          this.nextGameStartingPlayerIndex = loserIndex
        }
      }
    },
    saveWinsToLocalStorage () {
      const winsData = {}
      this.players.forEach(player => {
        winsData[player.name] = player.wins
      })
      localStorage.setItem('farkle-wins', JSON.stringify(winsData))
    },
    loadWinsFromLocalStorage (playerName) {
      const stored = localStorage.getItem('farkle-wins')
      if (stored) {
        try {
          const winsData = JSON.parse(stored)
          return winsData[playerName] || 0
        } catch (e) {
          return 0
        }
      }
      return 0
    },
    resetWinStatistics () {
      localStorage.removeItem('farkle-wins')
      this.players.forEach(player => {
        player.wins = 0
      })
    }
  }
}
</script>
