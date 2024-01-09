<template>
  <v-app>
    <v-toolbar app dark class="indigo">
      <v-toolbar-title class="headline">
        <span>Skull King Score Keeper</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-main>
      <v-content>
        <Game />
      </v-content>
    </v-main>
  </v-app>
</template>

<script>
import Game from './components/Game.vue'

export default {
  name: 'App',

  components: {
    Game,
  },

  data: () => ({
    //
  }),
}
</script>
