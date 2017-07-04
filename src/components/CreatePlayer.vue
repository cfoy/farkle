<template>
  <form v-on:submit.prevent v-on:submit="addPlayer">
    <v-layout row>
      <v-flex xs8>
        <v-text-field label="Name" v-model="name"></v-text-field>
      </v-flex>
      <v-flex xs4>
        <v-btn flat v-on:click.native="addPlayer">Add</v-btn>
      </v-flex>
    </v-layout>
  </form>
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
