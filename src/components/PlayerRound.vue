<template>
  <v-card>
    <v-card-title>
      <span class="player_round_title_first_item">{{ player_round.player.name }}</span>
      <span class="player_round_title_item">Round Score: {{ player_round.get_score() }}</span>
      <span class="player_round_title_item">Game Score: {{ player_round.get_cumulative_score() }}</span>
    </v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col cols="3">
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
                  <span class="clickable-icon" v-for="index in bid_options()" :key="index"
                    @click="set_bid_count(index)">{{
                      index
                    }}</span>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="blue-darken-1" variant="text" @click="bid_dialog = false">
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <span v-if="player_round.round.all_bids_placed()">
              <span class="trick_count" v-if="player_round.tricks_won != null"><b>Tricks Won:</b> {{
                player_round.tricks_won
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
                    <span class="clickable-icon" v-for="index in bid_options()" :key="index"
                      @click="set_won_count(index)">{{
                        index
                      }}</span>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="blue-darken-1" variant="text" @click="won_dialog = false">
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </span>
          </v-col>
          <v-col cols="6">
            <span v-if="player_round.round.is_current_round() && player_round.round.state == 2">
              <h3>Available Bonsues</h3>
              <v-chip-group>
                <v-chip v-for="capture_bonus in available_capture_bonuses()" :key="capture_bonus"
                  @click="claim_bonus(capture_bonus)">{{ capture_bonus.name }} ( {{ capture_bonus.count }})</v-chip>
              </v-chip-group>
            </span>
            <span v-if="player_round.round.state >= 2">
              <h3>Captured Bonsues</h3>
              <v-chip-group>
                <v-chip v-for="(capture_bonus, index) in player_round.bonuses" :key="capture_bonus"
                  :closable="player_round.round.state == 2" @click:close="remove_bonus(capture_bonus, index)">{{
                    capture_bonus.name }} (+{{ capture_bonus.points }} points)</v-chip>
              </v-chip-group>
            </span>
          </v-col>
          <v-col cols="3" v-if="!player_round.round.is_current_round() || player_round.round.state >= 2">
            <h3>Alliances</h3>
            <span v-if="player_round.round.is_current_round() && player_round.round.state == 2">
              <v-dialog v-model="alliance_dialog" width="400">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" size="small">Add Alliance</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    Select a player to form an alliance with
                  </v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item class="clickable-icon" v-for="player in get_other_players()" :key="player"
                        @click="add_alliance(player)">{{ player.name }}</v-list-item>
                    </v-list>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="blue-darken-1" variant="text" @click="alliance_dialog = false">
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </span>
            <span v-if="player_round.round.state >= 2">
              <v-chip-group>
                <v-chip v-for="alliance in player_round.alliances" :key="alliance"
                  :closable="player_round.round.is_current_round() && player_round.round.state == 2"
                  @click:close="remove_alliance(alliance)">
                  {{ alliance.player1.name + ' <-> ' + alliance.player2.name }}
                </v-chip>
              </v-chip-group>
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { Alliance } from './SkullKing.js'

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
      alliance_dialog: false,
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
      if (this.alliance_dialog && e.key === 'Escape') {
        this.alliance_dialog = false;
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
    },
    available_capture_bonuses() {
      let available_bonuses = [];
      for (const available_bonus of this.player_round.round.available_bonuses) {
        if (available_bonus.count > 0) {
          available_bonuses.push(available_bonus);
        }
      }
      return available_bonuses;
    },
    claim_bonus(bonus) {
      this.player_round.claim_bonus(bonus);
    },
    remove_bonus(bonus, index) {
      this.player_round.relinquish_bonus(bonus, index);
    },
    get_other_players() {
      let players = this.player_round.round.game.players.slice();
      let this_player_index = players.indexOf(this.player_round.player);
      if (this_player_index != -1) {
        players.splice(this_player_index, 1);
      }

      return players;
    },
    add_alliance(other_player) {
      this.alliance_dialog = false;
      let alliance = new Alliance(this.player_round.player, other_player);
      this.player_round.add_alliance(alliance);
    },
    remove_alliance(alliance) {
      this.player_round.remove_alliance(alliance);
    },
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
  padding-left: 0.6em;
  padding-right: 0.6em;
  padding-top: 0.6em;
  padding-bottom: 0.6em;
  margin-left: 0.4em;
  margin-right: 0.4em;
}
</style>