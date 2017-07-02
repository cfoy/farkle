<template>
  <md-table>
    <md-table-header>
      <md-table-row>
        <md-table-cell>
          Name
        </md-table-cell>
        <md-table-cell>
          Score
        </md-table-cell>
      </md-table-row>
    </md-table-header>
    <md-table-body>
      <md-table-row v-for="player in players" v-bind:key="player.id">
        <md-table-cell>
          {{ player.name }}
        </md-table-cell>
        <md-table-cell>
          {{ player.score }}
        </md-table-cell>
      </md-table-row>
    </md-table-body>
  </md-table>
</template>

<script>
  export default {
    props: ['players'],
    name: 'score'
  }
</script>
