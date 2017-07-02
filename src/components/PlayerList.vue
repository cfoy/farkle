<template>
  <md-table>
    <md-table-row v-for="player in players">
      <md-table-cell>
        {{ player.name }}
      </md-table-cell>
    </md-table-row>
  </md-table>
</template>

<script>
export default {
  props: ['players']
}
</script>
