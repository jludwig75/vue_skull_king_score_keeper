<template>
  <v-card>
    <v-card-title>
      <span class="player_round_title_first_item">{{ player_round.player.name }}</span>
      <span class="player_round_title_item">Round Score: {{ player_round.get_score() }}</span>
      <span class="player_round_title_item">Game Score: {{ player_round.get_accumulative_score() }}</span>
    </v-card-title>
    <v-card-text>
      <span class="trick_count" v-if="player_round.tricks_bid != null"><b>Tricks Bid:</b> {{ player_round.tricks_bid
      }}</span>
      <v-dialog v-if="player_round.round.is_current_round() && player_round.round.state == 1" v-model="bid_dialog"
        persistent width="400">
        <template v-slot:activator="{ props }">
          <v-btn v-if="player_round.tricks_bid == null" v-bind="props" size="small">Set Bid</v-btn>
          <v-btn v-else v-bind="props" icon size="x-small"><v-icon>mdi-pencil</v-icon></v-btn>
        </template>
        <v-card>
          <v-card-title>
            Set Bid
          </v-card-title>
          <v-card-text>
            <span class="clickable-icon" v-for="index in bid_options()" :key="index" @click="set_bid_count(index)">{{
              index
            }}</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="bid_dialog = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <span v-if="player_round.round.all_bids_placed()">
        <span class="trick_count" v-if="player_round.tricks_won != null"><b>Tricks Won:</b> {{ player_round.tricks_won
        }}</span>
        <v-dialog v-if="player_round.round.is_current_round() && player_round.round.state == 2" v-model="won_dialog"
          persistent width="400">
          <template v-slot:activator="{ props }">
            <v-btn v-if="player_round.tricks_won == null" v-bind="props" size="small">Set Tricks Won</v-btn>
            <v-btn v-else v-bind="props" icon size="x-small"><v-icon>mdi-pencil</v-icon></v-btn>
          </template>
          <v-card>
            <v-card-title>
              Set Tricks Won
            </v-card-title>
            <v-card-text>
              <span class="clickable-icon" v-for="index in bid_options()" :key="index" @click="set_won_count(index)">{{
                index
              }}</span>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="won_dialog = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </span>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'PlayerRound',
  props: {
    player_round: Object,
    round_state: Number,
  },
  data() {
    return {
      bid_dialog: false,
      won_dialog: false,
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  },
  methods: {
    place_bid() {

    },
    onKeyDown(e) {
      if (this.bid_dialog && e.key === 'Escape') {
        this.bid_dialog = false;
      }
      if (this.won_dialog && e.key === 'Escape') {
        this.won_dialog = false;
      }
    },
    bid_options() {
      let options = [];
      for (let i = 0; i <= this.player_round.round_number; i++) {
        options.push(i);
      }
      return options;
    },
    set_bid_count(number_of_tricks) {
      this.player_round.set_tricks_bid(number_of_tricks);
      this.bid_dialog = false;
    },
    set_won_count(number_of_tricks) {
      this.player_round.set_tricks_won(number_of_tricks);
      this.won_dialog = false;
    }
  }
}
</script>

<style scoped>
.player_round_title_first_item {
  width: 10em;
  display: inline-block;
  margin-right: 1em;
}

.player_round_title_item {
  width: 10em;
  display: inline-block;
  margin-left: 1em;
  margin-right: 1em;
}

.trick_count {
  margin-left: 1em;
  margin-right: 1em;
}

.clickable-icon {
  cursor: pointer;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin-left: 0.5em;
  margin-right: 0.5em;
}
</style>