<template>
  <v-card v-if="round != null">
    <v-card-title>
      Round {{ round.round_number }}
      <v-btn color="primary" v-if="round.state == 0 && round.all_bids_placed()" @click="round.start()" size="small">Start
        Round</v-btn>
      <span v-if="round.state == 1 && round.all_tricks_won_set()">
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
</template>

<script>
import PlayerRound from './PlayerRound.vue'

export default {
  name: 'GameRound',
  components: {
    PlayerRound
  },
  props: {
    round: Object
  },
  data() {
    return {
      round_state: 0
    }
  }
}
</script>
