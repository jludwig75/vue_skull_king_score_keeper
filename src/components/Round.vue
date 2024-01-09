<template>
  <v-card v-if="round != null">
    <v-card-title>
      Round {{ round.round_number }}
      <v-btn color="primary" v-if="round.state == 0 && round.all_bids_placed()" @click="round.start()">Start
        Round</v-btn>
      <v-btn color="primary" v-if="round.state == 1 && round.all_tricks_won_set()" @click="round.end()">End
        Round</v-btn>
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
