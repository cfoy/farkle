<template>
  <v-list>
    <v-list-subheader>Players</v-list-subheader>
    <v-list-item v-for="(player, index) in players" v-bind:key="index">
      <template v-slot:prepend>
        <v-icon>mdi-face</v-icon>
      </template>
      <v-list-item-title>
        {{ player.name }}
        <v-chip size="small" v-if="player.onBoard" color="success">On Board</v-chip>
        <v-chip size="small" v-else color="warning">Not On Board</v-chip>
      </v-list-item-title>
      <v-list-item-subtitle>Wins: {{ player.wins }}</v-list-item-subtitle>
      <template v-slot:append>
        {{ player.score }}
      </template>
    </v-list-item>
  </v-list>
</template>
<script>
  export default {
    props: ['players'],
    name: 'score'
  }
</script>
