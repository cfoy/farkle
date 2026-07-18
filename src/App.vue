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
  /* Globally scale typography by 30%. Vuetify's rem-based sizing
     inherits from the root font size, so all text scales together. */
  html {
    font-size: 130%;
  }

  body {
    margin: 30px;
  }

  /* On phone-width viewports the full 30% bump crowds/overflows the
     layout (e.g. the row of turn buttons), so ease the scale back and
     trim the body margin to reclaim horizontal space. */
  @media (max-width: 599px) {
    html {
      font-size: 115%;
    }

    body {
      margin: 12px;
    }
  }
</style>
