<template>
  <div v-if="started">
      <farkle-game v-bind:players="players"></farkle-game>
  </div>
  <div v-else>
    <v-card>
      <v-card-text>
        <create-player v-on:create-player="createPlayer"></create-player>
      </v-card-text>
      <v-card-text>
        <player-list v-bind:players="players"></player-list>
        <v-btn primary light v-on:click.native="startGame">Start Game</v-btn>
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
    }
  }
}
</script>
