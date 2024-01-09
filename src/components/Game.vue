<template>
  <v-container>
    <v-card>
      <v-card-title>
        Players
      </v-card-title>
      <v-card-text>
        <v-chip-group>
          <v-chip v-for="(player, index) in game.players" :key="player" :closable="game.rounds.length == 0"
            @click:close="delete_player(index)">
            {{ player.name }}
          </v-chip>
        </v-chip-group>
        <v-dialog v-model="dialog" persistent width="400">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" v-bind="props" v-if="game.players.length < 8 && game.rounds.length == 0">
              Add Player
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              Add Player
            </v-card-title>
            <v-card-text>
              <v-text-field label="Player Name" required v-model="new_player_name" autofocus
                @keyup.enter="on_dialog_add_button()" />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                Cancel
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="on_dialog_add_button()">
                Add
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>
    <Round v-for="round in game.rounds" :key="round" :round="round" />
    <v-card v-if="game.can_start_new_round()">
      <v-card-text>
        <v-btn color="primary" v-if="game.can_start_new_round()" @click="start_round()">
          <span v-if="game.rounds.length == 0">Start Game</span>
          <span v-else>Start Next Round</span>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { Game } from './SkullKing.js'
import Round from './Round.vue'

export default {
  name: 'SkullKingGame',
  components: {
    Round
  },
  data() {
    return {
      game: new Game(),
      dialog: false,
      new_player_name: ''
    };
  },
  created() {
    this.game.add_player("Jonathan");
    this.game.add_player("Deneen");
  },
  methods: {
    on_dialog_add_button() {
      this.dialog = false;
      this.game.add_player(this.new_player_name);
      this.new_player_name = '';
    },
    start_round() {
      this.game.start_next_round();
    },
    delete_player(index) {
      this.game.players.splice(index, 1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>