<template>
  <v-row>
    <v-col cols="12">
      <h5>Turn Total: {{ points }} points</h5>
    </v-col>
    <v-col cols="12">
      <v-btn variant="text" @click="one">One</v-btn>
      <v-btn variant="text" @click="five">Five</v-btn>
    </v-col>
    <v-col cols="12">
      <v-btn variant="text" @click="tripleOnes">111</v-btn>
      <v-btn variant="text" @click="tripleTwos">222</v-btn>
      <v-btn variant="text" @click="tripleThrees">333</v-btn>
      <v-btn variant="text" @click="tripleFours">444</v-btn>
      <v-btn variant="text" @click="tripleFives">555</v-btn>
      <v-btn variant="text" @click="tripleSixes">666</v-btn>
    </v-col>
    <v-col cols="12">
      <v-btn variant="text" @click="fourOfAKind">Four of a Kind</v-btn>
      <v-btn variant="text" @click="fiveOfAKind">Five of a Kind</v-btn>
      <v-btn variant="text" @click="sixOfAKind">Six of a Kind</v-btn>
    </v-col>
    <v-col cols="12">
      <v-btn variant="text" @click="straight">Straight</v-btn>
      <v-btn variant="text" @click="threePairs">Three Pairs</v-btn>
      <v-btn variant="text" @click="fourPlusTwo">Four of a Kind Plus a Pair</v-btn>
      <v-btn variant="text" @click="twoThreeOfAKind">Three of a Kind x 2</v-btn>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col cols="6" class="text-center pa-1">
          <v-btn color="primary" block class="action-btn" @click="done">Done</v-btn>
        </v-col>
        <v-col cols="6" class="text-center pa-1">
          <v-btn color="error" block class="action-btn" @click="farkle">Farkle!</v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'farkle-turn',

  props: ['currentPlayer'],

  data () {
    return {
      points: 0
    }
  },

  methods: {
    one () {
      this.points += 100
    },
    five () {
      this.points += 50
    },
    tripleOnes () {
      this.points += 300
    },
    tripleTwos () {
      this.points += 200
    },
    tripleThrees () {
      this.points += 300
    },
    tripleFours () {
      this.points += 400
    },
    tripleFives () {
      this.points += 500
    },
    tripleSixes () {
      this.points += 600
    },
    fourOfAKind () {
      this.points += 1000
    },
    fiveOfAKind () {
      this.points += 2000
    },
    sixOfAKind () {
      this.points += 3000
    },
    straight () {
      this.points += 1500
    },
    threePairs () {
      this.points += 1500
    },
    fourPlusTwo () {
      this.points += 1500
    },
    twoThreeOfAKind () {
      this.points += 2500
    },
    farkle () {
      this.points = 0
      this.done()
    },
    done () {
      // Check if player is not on board and trying to bank less than 500
      // Allow farkles (0 points) to always go through
      if (!this.currentPlayer.onBoard && this.points > 0 && this.points < 500) {
        alert('You need 500 points to get on the board. Keep rolling or Farkle!')
        return
      }

      this.$emit('score', this.points)
      this.points = 0
    }
  }
}
</script>

<style scoped>
.action-btn :deep(.v-btn__content) {
  padding: 0 !important;
}

.action-btn {
  padding: 6px 12px !important;
  min-height: 40px !important;
  height: 40px !important;
}
</style>
