<template>
  <v-card v-if="round != null">
    <v-card-title>
      Round {{ round.round_number }}
      <v-btn color="primary" v-if="round.state == 0" @click="on_click_start_round()" size="small">Start
        Round</v-btn>
      <span v-if="round.state == 1 && round.all_bids_placed()">
        <v-btn color="primary" @click="round.start_playing()" size="small">End
          Bidding</v-btn>
      </span>
      <span v-if="round.state == 2 && round.all_tricks_won_set()">
        <v-btn color="primary"
          v-if="round.total_tricks_won() <= round.round_number && round.total_bonuses_claimed() <= round.total_tricks_won()"
          @click="round.end()" size="small">End
          Round</v-btn>
        <v-alert class="multi-line" type="error" v-else>
          {{ end_game_error_message() }}
        </v-alert>
      </span>
    </v-card-title>
    <v-card-text>
      <PlayerRound v-for="player_round in round.player_rounds" :key="player_round" :player_round="player_round"
        :round_state="round_state" />
    </v-card-text>
  </v-card>
  <v-dialog v-model="show_yo_ho_ho" width="200">
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
    end_game_error_message() {
      let error_message = '';
      if (this.round.total_tricks_won() > this.round.round_number) {
        error_message += " - The total number of tricks won for all players (" + this.round.total_tricks_won() + ") is too high for this round (" + this.round.round_number + ")";
      }
      console.log("Total bonuses claimed: " + this.round.total_bonuses_claimed());
      console.log("Total tricks won: " + this.round.total_tricks_won());
      if (this.round.total_bonuses_claimed() > Math.min(this.round.total_tricks_won(), this.round.round_number)) {
        if (error_message.length > 0) {
          error_message += "\n";
        }
        error_message += " - The total number of bonuses claimed for all players (" + this.round.total_bonuses_claimed() + ") is too high for the number of tricks won or that can be won (" + Math.min(this.round.total_tricks_won(), this.round.round_number) + ")";
      }
      for (const player_round of this.round.player_rounds) {
        if (player_round.bonuses.length > player_round.tricks_won) {
          if (error_message.length > 0) {
            error_message += "\n";
          }
          error_message += " - " + player_round.player.name + " has claimed more bonuses (" + player_round.bonuses.length + ") than tricks won (" + player_round.tricks_won + ")";
        }
      }
      if (error_message.length > 0) {
        error_message = "You must correct the scoring befor you can end the round:\n" + error_message
      }
      console.log("Set error messages to " + error_message);
      return error_message;
    },
  }
}
</script>

<style scoped>
.multi-line {
  white-space: pre-line;
}
</style>
