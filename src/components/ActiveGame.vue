<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12 sm12 md6 lg6>
        <v-card>
          <v-card-text>
            <farkle-turn v-on:score="onScore" v-bind:current-player="currentPlayer"></farkle-turn>
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
</template>

<script>
import Score from './Score.vue'
import FarkleTurn from './FarkleTurn.vue'

export default {
  name: 'active-game',
  components: {
    Score,
    FarkleTurn
  },

  props: {
    currentPlayer: {
      type: Object,
      required: true
    },
    currentPlayerName: {
      type: String,
      required: true
    },
    players: {
      type: Array,
      required: true
    }
  },

  methods: {
    onScore (points) {
      this.$emit('score', points)
    }
  }
}
</script>
