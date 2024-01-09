<template>
  <v-card>
    <v-card-title>
      <span>{{ player_round.player.name }}</span>
      <span class="trick_count">Score: {{ player_round.get_accumulative_score() }}</span>
      <span class="trick_count">Round Score: {{ player_round.get_score() }}</span>
    </v-card-title>
    <v-card-text>
      <span class="trick_count" v-if="player_round.tricks_bid != null">Tricks Bid: {{ player_round.tricks_bid
      }}</span>
      <span class="trick_count" v-else>Tricks Bid: </span>
      <v-dialog v-if="player_round.round.is_current_round() && player_round.round.state == 0" v-model="bid_dialog"
        persistent width="400">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props">Set Bid</v-btn>
        </template>
        <v-card>
          <v-card-title>
            Set Bid
          </v-card-title>
          <v-card-text>
            <span class="trick_count" v-for="index in bid_options()" :key="index" @click="set_bid_count(index)">{{ index
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
        <span class="trick_count" v-if="player_round.tricks_won != null">Tricks Won: {{ player_round.tricks_won
        }}</span>
        <v-dialog v-if="player_round.round.is_current_round() && player_round.round.state == 1" v-model="won_dialog"
          persistent width="400">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">Set Tricks Won</v-btn>
          </template>
          <v-card>
            <v-card-title>
              Set Tricks Won
            </v-card-title>
            <v-card-text>
              <span class="trick_count" v-for="index in bid_options()" :key="index" @click="set_won_count(index)">{{ index
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
.trick_count {
  padding-left: 1em;
  padding-right: 1em;
}
</style>