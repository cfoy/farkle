<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-text>
            <farkle-turn v-on:score="onScore" v-bind:current-player="currentPlayer"></farkle-turn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-text>
            <score v-bind:players="players"></score>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
