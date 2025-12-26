<template>
  <v-list>
    <v-list-subheader>Players</v-list-subheader>
    <v-list-item v-for="(player, index) in players" v-bind:key="index">
      <template v-slot:prepend>
        <v-icon>mdi-face</v-icon>
      </template>
      <v-list-item-title>
        {{ player.name }} ({{ player.wins || 0 }} wins)
      </v-list-item-title>
      <template v-slot:append>
        <v-icon @click="removePlayer(index)">mdi-close</v-icon>
      </template>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: ['players'],

  methods: {
    removePlayer (index) {
      this.players.splice(index, 1)
    }
  }
}
</script>
