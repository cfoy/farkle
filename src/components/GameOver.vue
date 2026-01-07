<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h3>Game Over!</h3>
          </v-card-title>
          <v-card-text>
            <h4 v-if="winner">Winner: {{ winner.name }} with {{ winner.score }} points!</h4>
            <p v-if="winner" class="win-count"><strong>Total Wins: {{ winner.wins }}</strong></p>
            <score
              v-bind:players="players"
              v-bind:next-starter-index="nextStarterIndex">
            </score>
            <v-row class="mt-6">
              <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-end">
                <v-btn
                  color="success"
                  variant="elevated"
                  size="large"
                  @click="playAgain"
                  class="mx-2">
                  Play Again
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-start">
                <v-btn
                  color="primary"
                  variant="outlined"
                  size="large"
                  @click="changePlayers"
                  class="mx-2">
                  Change Players
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
    },
    nextStarterIndex: {
      type: Number,
      default: null
    }
  },
  methods: {
    playAgain () {
      this.$emit('play-again')
    },
    changePlayers () {
      this.$emit('change-players')
    }
  }
}
</script>
