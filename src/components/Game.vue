<template>
  <div class="game-outer" v-if="game.rounds.length == 0">
    <h2>
      Players
    </h2>
    <v-chip-group>
      <v-chip v-for="(player, index) in game.players" :key="player" :closable="game.rounds.length == 0"
        @click:close="delete_player(index)">
        {{ player.name }}
      </v-chip>
    </v-chip-group>
    <v-dialog v-model="dialog" persistent width="400">
      <template v-slot:activator="{ props }">
        <v-btn size="small" color="primary" v-bind="props" v-if="game.players.length < 8 && game.rounds.length == 0">
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
          <v-btn color="blue-darken-1" variant="text" @click="close_dialog()">
            Cancel
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="on_dialog_add_button()">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div class="game-outer" v-if="game.rounds.length == 0">
    <h2 style="margin-bottom: 0.3em;">
      Game Settings
    </h2>
    <b>Number of Rounds:</b> {{ number_of_rounds }}
    <v-slider v-model="number_of_rounds" :min="1" :max="10" :step="1" thumb-label show-ticks="always" tick-size="1">
    </v-slider>
  </div>
  <Round v-for="round in game.rounds" :key="round" :round="round" @endRound="on_round_complete()" />
  <div class="game-outer" v-if="game.can_start_new_round()">
    <v-btn color="primary" v-if="game.can_start_new_round()" @click="start_round()">
        <span v-if="game.rounds.length == 0">Start Game</span>
        <span v-else>Go To Next Round</span>
      </v-btn>
  </div>
  <GameResults v-if="game.is_complete()" :results="game.results"></GameResults>
  <v-dialog v-model="game_results_dialog" width="600">
    <GameResults v-if="game.is_complete()" :results="game.results"></GameResults>
    <v-btn @click="game_results_dialog = false">Close</v-btn>
  </v-dialog>
</template>

<script>
import { Game } from './SkullKing.js'
import GameResults from './GameResults.vue'
import Round from './Round.vue'

export default {
  name: 'SkullKingGame',
  props: {
    create_new_game: Number,
  },
  components: {
    Round,
    GameResults
  },
  data() {
    return {
      game: new Game(),
      dialog: false,
      new_player_name: '',
      disable_game_save: false,
      number_of_rounds: 10,
      game_results_dialog: false,
    };
  },
  mounted() {
    let game_json = localStorage.getItem('game');
    if (game_json) {
      console.log('Found save game. Attempting to deserialize "' + game_json + '""');
      this.disable_game_save = true;
      this.game = Game.deserialize(game_json);
      this.disable_game_save = false;
      console.log('Successfully deserialized saved game');
    }
    window.addEventListener('keydown', this.onKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  },
  watch: {
    game: {
      handler(newVal) {
        if (this.disable_game_save) {
          console.log('Game save disabled');
          return;
        }
        // Store the updated game score object
        let game_json = newVal.serialize();
        console.log('Saving serialized game state on modification "' + game_json + '"');
        localStorage.setItem('game', game_json);
        console.log('Saved serialized game state on modification');
      },
      deep: true // Enable deep watching
    },
    create_new_game(newValue, oldValue) {
      console.log('create_new_game changed. old: ' + oldValue + ' new: ' + newValue);
      if (newValue === oldValue + 1) {
        this.game = new Game();
        this.number_of_rounds = 10;
      }
    }
  },
  methods: {
    on_dialog_add_button() {
      this.dialog = false;
      this.game.add_player(this.new_player_name);
      this.new_player_name = '';
    },
    close_dialog() {
      if (this.dialog) {
        this.new_player_name = '';
        this.dialog = false;
      }
    },
    start_round() {
      if (this.game.rounds.length == 0) {
        this.game.number_of_rounds = this.number_of_rounds;
        this.number_of_rounds = 10;
      }
      this.game.start_next_round();
    },
    delete_player(index) {
      this.game.players.splice(index, 1);
    },
    onKeyDown(e) {
      if (e.key === 'Escape') {
        this.close_dialog()
      }
      if (this.game_results_dialog && e.key === 'Escape') {
        this.game_results_dialog = false;
      }
    },
    on_round_complete() {
      if (this.game.is_complete()) {
        this.game_results_dialog = true;
      } else {
        this.game.start_next_round();
      }
    },
    place_string(place) {
      if (place % 10 === 1) {
        return place + 'st';
      }
      if (place % 10 === 2) {
        return place + 'nd';
      }
      if (place % 10 === 3) {
        return place + 'rd';
      }
      return place + 'th';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>