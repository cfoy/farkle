<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h3>It's a Tie!</h3>
          </v-card-title>
          <v-card-text>
            <p>The following players are tied with {{ highestScore }} points:</p>
            <p><strong>Roll a die to determine the winner!</strong></p>
            <p>Each tied player should roll one die. The player with the highest roll wins.</p>
            <p>If there's still a tie, re-roll until there's a winner.</p>
            <p>Click the button for the player who rolled the highest:</p>

            <v-row>
              <v-col cols="12" sm="6" md="4" v-for="index in tiedPlayerIndices" v-bind:key="index">
                <v-btn
                  color="primary"
                  size="large"
                  block
                  @click="selectWinner(index)">
                  {{ players[index].name }} - {{ players[index].score }} points
                </v-btn>
              </v-col>
            </v-row>

            <score v-bind:players="players"></score>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Score from './Score.vue'

export default {
  name: 'tie-breaker',
  components: {
    Score
  },
  props: {
    players: {
      type: Array,
      required: true
    },
    tiedPlayerIndices: {
      type: Array,
      required: true
    },
    highestScore: {
      type: Number,
      required: true
    }
  },
  methods: {
    selectWinner (playerIndex) {
      this.$emit('select-winner', playerIndex)
    }
  }
}
</script>
