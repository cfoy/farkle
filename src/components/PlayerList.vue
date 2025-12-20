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
        </v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-icon v-on:click="removePlayer(index)">clear</v-icon>
      </v-list-tile-action>
    </v-list-tile>
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
