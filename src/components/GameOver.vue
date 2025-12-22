<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h3>Game Over!</h3>
          </v-card-title>
          <v-card-text>
            <h4 v-if="winner">Winner: {{ winner.name }} with {{ winner.score }} points!</h4>
            <p v-if="winner" class="win-count"><strong>Total Wins: {{ winner.wins }}</strong></p>
            <score v-bind:players="players"></score>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Score from './Score.vue'

export default {
  name: 'game-over',
  components: {
    Score
  },
  props: {
    players: {
      type: Array,
      required: true
    },
    winner: {
      type: Object,
      default: null
    }
  }
}
</script>
