<template>
  <v-list subheader>
    <v-subheader>Players</v-subheader>
    <v-list-item v-for="(player, index) in players" v-bind:key="index">
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <v-icon>face</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ player.name }}
          </v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          {{ player.score }}
        </v-list-tile-action>
      </v-list-tile>
    </v-list-item>
  </v-list>
</template>
<script>
  export default {
    props: ['players'],
    name: 'score'
  }
</script>
