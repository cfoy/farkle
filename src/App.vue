<template>
  <v-app>
    <v-navigation-drawer></v-navigation-drawer>
    <v-toolbar light>
       <v-toolbar-title>Farkle</v-toolbar-title>
    </v-toolbar>
    <main>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
    </main>
    <v-footer></v-footer>
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
