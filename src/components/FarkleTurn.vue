<template>
  <v-layout row wrap>
    <v-flex xs12>
      <h5>Points: {{ points }}</h5>
    </v-flex>
    <v-flex xs12>
      <v-btn flat v-on:click.native="one">One</v-btn>
      <v-btn flat v-on:click.native="five">Five</v-btn>
    </v-flex>
    <v-flex xs12>
      <v-btn flat v-on:click.native="tripleOnes">111</v-btn>
      <v-btn flat v-on:click.native="tripleTwos">222</v-btn>
      <v-btn flat v-on:click.native="tripleThrees">333</v-btn>
      <v-btn flat v-on:click.native="tripleFours">444</v-btn>
      <v-btn flat v-on:click.native="tripleFives">555</v-btn>
      <v-btn flat v-on:click.native="tripleSixes">666</v-btn>
    </v-flex>
    <v-flex xs12>
      <v-btn flat v-on:click.native="fourOfAKind">Four of a Kind</v-btn>
      <v-btn flat v-on:click.native="fiveOfAKind">Five of a Kind</v-btn>
      <v-btn flat v-on:click.native="sixOfAKind">Six of a Kind</v-btn>
    </v-flex>
    <v-flex xs12>
      <v-btn flat v-on:click.native="straight">Straight</v-btn>
      <v-btn flat v-on:click.native="threePairs">Three Pairs</v-btn>
      <v-btn flat v-on:click.native="fourPlusTwo">Four of a Kind Plus a Pair</v-btn>
      <v-btn flat v-on:click.native="twoThreeOfAKind">Three of a Kind x 2</v-btn>
    </v-flex>
    <v-flex xs12>
      <v-btn primary light v-on:click.native="done">Done</v-btn>
      <v-btn error light v-on:click.native="farkle">Farkle!</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'farkle-turn',

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
      this.$emit('score', this.points)
      this.points = 0
    }
  }
}
</script>
