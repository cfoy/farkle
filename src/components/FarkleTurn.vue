<template>
  <div class="farkle-turn">
    <h3>Points: {{ points }}</h3>
    <md-button v-on:click="one">One</md-button>
    <md-button v-on:click="five">Five</md-button>
    <md-button v-on:click="tripleOnes">111</md-button>
    <md-button v-on:click="tripleTwos">222</md-button>
    <md-button v-on:click="tripleThrees">333</md-button>
    <md-button v-on:click="tripleFours">444</md-button>
    <md-button v-on:click="tripleFives">555</md-button>
    <md-button v-on:click="tripleSixes">666</md-button>
    <md-button v-on:click="fourOfAKind">Four of a Kind</md-button>
    <md-button v-on:click="fiveOfAKind">Five of a Kind</md-button>
    <md-button v-on:click="sixOfAKind">Six of a Kind</md-button>
    <md-button v-on:click="straight">Straight</md-button>
    <md-button v-on:click="threePairs">Three Pairs</md-button>
    <md-button v-on:click="fourPlusTwo">Four of a Kind Plus a Pair</md-button>
    <md-button v-on:click="twoThreeOfAKind">Three of a Kind x 2</md-button>
    <div>
      <md-button class="md-raised md-primary" v-on:click="done">Done</md-button>
      <md-button class="md-raised md-warn" v-on:click="farkle">Farkle!</md-button>
    </div>
  </div>
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

<style scoped>
  h2 {
    color: red;
  }
</style>
