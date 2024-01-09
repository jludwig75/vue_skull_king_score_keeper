<template>
  <v-card v-if="round != null">
    <v-card-title>
      Round {{ round.round_number }}
      <v-btn color="primary" v-if="round.state == 0" @click="on_click_start_round()" size="small">Start
        Round</v-btn>
      <v-btn color="primary" v-if="round.state == 1 && round.all_bids_placed()" @click="round.start_playing()"
        size="small">End
        Bidding</v-btn>
      <span v-if="round.state == 2 && round.all_tricks_won_set()">
        <v-btn color="primary" v-if="round.total_tricks_won() <= round.round_number" @click="round.end()" size="small">End
          Round</v-btn>
        <v-alert type="error" v-else>The total number of tricks won for all players is too high for this round</v-alert>
      </span>
    </v-card-title>
    <v-card-text>
      <PlayerRound v-for="player_round in round.player_rounds" :key="player_round" :player_round="player_round"
        :round_state="round_state" />
    </v-card-text>
  </v-card>
  <v-dialog v-model="show_yo_ho_ho" width="400">
    <v-card>
      <v-card-title>
        Starting Round {{ round.round_number }}
      </v-card-title>
      <v-card-text>
        {{ yo_ho_ho_message }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import PlayerRound from './PlayerRound.vue'

export default {
  name: 'GameRound',
  components: {
    PlayerRound
  },
  props: {
    round: Object,
  },
  data() {
    return {
      round_state: 0,
      show_yo_ho_ho: false,
      yo_ho_ho_message: ''
    }
  },
  methods: {
    on_click_start_round() {
      this.yo_ho_ho_message = 'Get ready for round ' + this.round.round_number + '...'
      this.show_yo_ho_ho = true;
      setTimeout(() => {
        this.yo_ho_ho_message = 'Yo... '
      }, 2000);
      setTimeout(() => {
        this.yo_ho_ho_message += 'Ho... '
      }, 3000);
      setTimeout(() => {
        this.yo_ho_ho_message += 'Ho!'
      }, 4000);
      setTimeout(() => {
        this.show_yo_ho_ho = false;
        this.round.start();
      }, 5000); // 3000 milliseconds = 3 seconds
    },
  }
}
</script>
