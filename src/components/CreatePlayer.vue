<template>
  <div class="create-player">
    <form v-on:submit.prevent v-on:submit="addPlayer">
      <md-input-container>
        <label>Name: </label>
        <md-input type="text" v-model="name"></md-input>
        <md-button class="md-button md-theme-default" v-on:click="addPlayer">Add</md-button>
      </md-input-container>
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
      if (this.name.length > 0) {
        this.$emit('create-player', {
          name: this.name,
          score: 0
        })
        this.name = ''
      }
    }
  }
}
</script>
