<template>
  <div v-if="started">
      <farkle-game v-bind:players="players" v-on:game-end="handleGameEnd"></farkle-game>
      <v-card>
        <v-btn color="primary" v-on:click.native="restartGame">Restart Game</v-btn>
      </v-card>
  </div>
  <div v-else>
    <v-card>
      <v-card-text>
        <create-player v-on:create-player="createPlayer"></create-player>
      </v-card-text>
      <v-card-text>
        <player-list v-bind:players="players"></player-list>
        <v-btn color="primary" v-on:click.native="startGame">Start Game</v-btn>
        <v-btn flat v-on:click.native="resetWinStatistics">Reset Win Statistics</v-btn>
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
      started: false
    }
  },

  methods: {
    createPlayer (player) {
      this.players.push(player)
    },
    startGame () {
      if (this.players.length >= 2) {
        this.started = true
      }
    },
    restartGame () {
      this.players.forEach(function (player) {
        player.score = 0
        player.onBoard = false
      })
      this.started = false
    },
    handleGameEnd (winner) {
      // Increment the winner's wins count
      if (winner && winner.wins !== undefined) {
        winner.wins += 1
        // Save to localStorage
        this.saveWinsToLocalStorage()
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
