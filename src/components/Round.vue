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
        <v-btn color="primary" v-if="score_is_valid()" @click="end_round()" size="small">End
          Round</v-btn>
        <v-alert class="multi-line" type="error" v-else>
          {{ end_game_error_message() }}
        </v-alert>
      </span>
    </v-card-title>
    <v-card-text class="px-2">
      <PlayerRound v-for="player_round in round.player_rounds" :key="player_round" :player_round="player_round"
        :round_state="round_state" />
    </v-card-text>
  </v-card>
  <v-dialog v-model="show_yo_ho_ho" width="195">
    <v-card>
      <v-card-title>
        Starting Round {{ round.round_number }}
      </v-card-title>
      <v-card-text class="px-0">
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
      this.yo_ho_ho_message = "Get ready to start round " + this.round.round_number + "!";
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
      let number_of_cards_per_trick = this.round.game.players.length;
      let max_possible_total_bonuses = number_of_cards_per_trick * Math.min(this.round.total_tricks_won(), this.round.round_number);
      if (this.round.total_bonuses_claimed() > max_possible_total_bonuses) {
        if (error_message.length > 0) {
          error_message += "\n";
        }
        error_message += " - The total number of bonuses claimed for all players (" + this.round.total_bonuses_claimed() + ") is higher than possible on this round (" + max_possible_total_bonuses + ")";
      }
      for (const player_round of this.round.player_rounds) {
        let max_possible_player_bonuses = (number_of_cards_per_trick - 1) * player_round.tricks_won;
        if (player_round.bonuses.length > max_possible_player_bonuses) {
          if (error_message.length > 0) {
            error_message += "\n";
          }
          error_message += " - " + player_round.player.name + " has claimed more bonuses (" + player_round.bonuses.length + ") than possible on this round (" + max_possible_player_bonuses + ")";
        }
      }
      if (error_message.length > 0) {
        error_message = "You must correct the scoring befor you can end the round:\n" + error_message
      }
      console.log("Set error messages to " + error_message);
      return error_message;
    },
    score_is_valid() {
      console.log("this.round: " + this.round);
      console.log("this.round.game: " + this.round.game);
      console.log("this.round.game.players: " + this.round.game.players);
      console.log("this.round.game.players.length: " + this.round.game.players.length);
      var number_of_cards_per_trick = this.round.game.players.length;
      console.log("number_of_cards_per_trick: " + number_of_cards_per_trick);
      let max_possible_total_bonuses = number_of_cards_per_trick * Math.min(this.round.total_tricks_won(), this.round.round_number);
      if (this.round.total_tricks_won() > this.round.round_number || this.round.total_bonuses_claimed() > max_possible_total_bonuses) {
        return false;
      }
      for (const player_round of this.round.player_rounds) {
        let max_possible_player_bonuses = (number_of_cards_per_trick - 1) * player_round.tricks_won;
        console.log("max_possible_player_bonuses: " + max_possible_player_bonuses);
        console.log(player_round.player.name + ": player_round.tricks_won: " + player_round.tricks_won);
        console.log(player_round.player.name + ": max_possible_player_bonuses: " + max_possible_player_bonuses);
        console.log(player_round.player.name + ": player_round.bonuses.length: " + player_round.bonuses.length);
        if (player_round.bonuses.length > max_possible_player_bonuses) {
          return false;
        }
      }

      return true;
    },
    end_round() {
      this.round.end();
      this.$emit('endRound');
    }
  }
}
</script>

<style scoped>
.multi-line {
  white-space: pre-line;
}
</style>
