<template>
  <v-container>
    <v-app>
      <v-toolbar app dark class="indigo">
        <v-toolbar-title class="headline">
          <span>Skull King Score Keeper</span>
          <v-dialog v-model="new_game_dialog" width="433">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props" size="small">New Game</v-btn>
            </template>
            <v-card>
              <v-card-title>
                Are you sure you want to start a new game?
              </v-card-title>
              <v-card-text>
                <v-btn color="blue-darken-1" variant="text" @click="on_new_game()">
                  Yes
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="new_game_dialog = false">
                  No
                </v-btn>
              </v-card-text>
              <v-card-actions>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar-title>
      </v-toolbar>
      <v-main>
        <Game :create_new_game="create_new_game" />
      </v-main>
    </v-app>
  </v-container>
</template>

<script>
import Game from './components/Game.vue'

export default {
  name: 'App',

  components: {
    Game,
  },

  data: () => ({
    new_game_dialog: false,
    create_new_game: 0,
  }),
  methods: {
    on_new_game() {
      this.new_game_dialog = false;
      this.create_new_game++;
      console.log('Incremented this.create_new_game to ' + this.create_new_game);
    }
  }
}
</script>
