<template>
  <div class="farkle-turn">
    <hr>
    <h2>Current Turn</h2>
    <h3>Points: {{ points }}</h3>
    <button v-on:click="one">One</button>
    <button v-on:click="five">Five</button>
    <button v-on:click="tripleOnes">111</button>
    <button v-on:click="tripleTwos">222</button>
    <button v-on:click="tripleThrees">333</button>
    <button v-on:click="tripleFours">444</button>
    <button v-on:click="tripleFives">555</button>
    <button v-on:click="tripleSixes">666</button>
    <button v-on:click="fourOfAKind">Four of a Kind</button>
    <button v-on:click="fiveOfAKind">Five of a Kind</button>
    <button v-on:click="sixOfAKind">Six of a Kind</button>
    <button v-on:click="straight">Straight</button>
    <button v-on:click="threePairs">Three Pairs</button>
    <button v-on:click="fourPlusTwo">Four of a Kind Plus a Pair</button>
    <button v-on:click="twoThreeOfAKind">Three of a Kind x 2</button>
    <div>
      <button v-on:click="done">Done</button>
      <button v-on:click="farkle">Farkle!</button>
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
