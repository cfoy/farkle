<template>
  <div class="create-player">
    <h3>Add Player</h3>
    <form v-on:submit.prevent v-on:submit="addPlayer">
      <label for="player_name">Name: </label>
      <input id="player_name" type="text" v-model="name">
      <button>Add</button>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name
    }
  },
  name: 'create-player',
  methods: {
    addPlayer () {
      this.$emit('create-player', {
        name: this.name,
        score: 0
      })
      this.name = ''
    }
  }
}
</script>
