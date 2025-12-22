<template>
  <div>
    <v-layout row wrap>
      <v-flex xs12>
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

            <v-layout row wrap>
              <v-flex xs12 sm6 md4 v-for="index in tiedPlayerIndices" v-bind:key="index">
                <v-btn
                  primary
                  light
                  large
                  block
                  v-on:click.native="selectWinner(index)">
                  {{ players[index].name }} - {{ players[index].score }} points
                </v-btn>
              </v-flex>
            </v-layout>

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
