<template>
  <v-list subheader>
    <v-subheader>Players</v-subheader>
    <v-list-tile avatar v-for="(player, index) in players" v-bind:key="index">
      <v-list-tile-avatar>
        <v-icon>face</v-icon>
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>
          {{ player.name }}
          <v-chip small v-if="player.onBoard" success>On Board</v-chip>
          <v-chip small v-else warning>Not On Board</v-chip>
        </v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-action>
        {{ player.score }}
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>
<script>
  export default {
    props: ['players'],
    name: 'score'
  }
</script>
