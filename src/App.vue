<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>Farkle</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  body {
    margin: 30px;
  }
</style>
