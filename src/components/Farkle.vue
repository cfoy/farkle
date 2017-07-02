<template>
  <div v-if="started">
    <md-card>
      <md-card-header>
        <h1 class="md-title">Farkle</h1>
      </md-card-header>
      <md-card-content>
        <farkle-game v-bind:players="players"></farkle-game>
      </md-card-content>
    </md-card>
  </div>
  <div v-else>
    <md-card>
      <md-card-header>
        <h1 class="md-title">Farkle</h1>
      </md-card-header>
      <md-card-content>
        <create-player v-on:create-player="createPlayer"></create-player>
      </md-card-content>
    </md-card>
    <md-card>
      <md-card-header>
        <h1 class="md-title">Players</h1>
      </md-card-header>
      <md-card-content>
        <player-list v-bind:players="players"></player-list>
        <md-button v-on:click="startGame" class="md-raised md-primary">Start Game</md-button>
      </md-card-content>
    </md-card>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
