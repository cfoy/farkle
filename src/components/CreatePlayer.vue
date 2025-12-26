<template>
  <form v-on:submit.prevent v-on:submit="addPlayer">
    <v-row>
      <v-col cols="8">
        <v-text-field label="Name" v-model="name"></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-btn variant="text" @click="addPlayer">Add</v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script>
export default {
  data () {
    return {
      name: ''
    }
  },
  name: 'create-player',
  methods: {
    addPlayer () {
      if (this.name.trim().length > 0) {
        this.$emit('create-player', {
          name: this.name,
          score: 0,
          onBoard: false,
          wins: this.loadWinsFromLocalStorage(this.name)
        })
        this.name = ''
      }
    },
    loadWinsFromLocalStorage (playerName) {
      const stored = localStorage.getItem('farkle-wins')
      if (stored) {
        try {
          const winsData = JSON.parse(stored)
          return winsData[playerName] || 0
        } catch (e) {
          return 0
        }
      }
      return 0
    }
  }
}
</script>
