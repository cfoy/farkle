<template>
  <div class="farkle">
    <h1>Farkle</h1>
    <div v-if="started">
      <farkle-game v-bind:players="players"></farkle-game>
    </div>
    <div v-else>
      <create-player v-on:create-player="createPlayer"></create-player>
      <player-list v-bind:players="players"></player-list>
      <button v-on:click="startGame">Start Game</button>
    </div>
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
