<template>
  <v-card style="border: 1px;">
    <v-card-title class="px-1 py-2">
      <v-row>
        <v-col cols="5">{{ player_round.player.name }}</v-col>
        <v-col cols="7" v-if="player_round.round.state != 0">Points: {{ player_round.get_score() }} / {{
          player_round.get_cumulative_score() }} </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="px-2 pb-1">
      <!-- Bids/Alliances -->
      <v-row class="pa-0 ma-0" v-if="player_round.round.state > 0">

        <!-- Bids -->
        <v-col cols="5" class="pa-0 ma-0 px-1">
          <h3>Tricks</h3>
          <span
            v-if="player_round.round.is_current_round() && player_round.round.state != 3 && player_round.round.state != 0"
            class="my-2">
            <div class="px-2 my-1 pt-2">
              <span v-if="player_round.tricks_bid != null"><b>Bid:</b> {{
                player_round.tricks_bid
              }}</span>
              <v-dialog v-if="player_round.round.is_current_round() && player_round.round.state == 1" v-model="bid_dialog"
                persistent width="400">
                <template v-slot:activator="{ props }">
                  <v-btn class="pl-0 ml-0" v-if="player_round.tricks_bid == null" v-bind="props" size="small">Set Bid</v-btn>
                  <v-btn class="mx-2" v-else v-bind="props" icon size="x-small"><v-icon>mdi-pencil</v-icon></v-btn>
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
            </div>
            <div class="px-2 my-1 pb-2">
              <span v-if="player_round.round.all_bids_placed()">
                <span v-if="player_round.tricks_won != null"><b>Won:</b> {{
                  player_round.tricks_won
                }}</span>
                <v-dialog v-if="player_round.round.is_current_round() && player_round.round.state == 2"
                  v-model="won_dialog" persistent width="400">
                  <template v-slot:activator="{ props }">
                    <v-btn class="p1-0 m1-0" v-if="player_round.tricks_won == null" v-bind="props" size="small">Tricks Won</v-btn>
                    <v-btn class="mx-2" v-else v-bind="props" icon size="x-small"><v-icon>mdi-pencil</v-icon></v-btn>
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
            </div>
          </span>
          <span v-else>
            <span v-if="player_round.round.state > 2">
              {{ player_round.tricks_won }} / {{ player_round.tricks_bid }}
            </span>
          </span>
        </v-col>

        <!-- Alliances -->
        <v-col cols="7" class="pa-0 ma-0">
          <span style="display: flex;">
            <h3>Alliances</h3>
            <span v-if="player_round.round.is_current_round() && player_round.round.state == 2">
              <v-dialog v-model="alliance_dialog" width="400">
                <template v-slot:activator="{ props }">
                  <v-btn class="mx-2" v-bind="props" size="x-small"><v-icon>mdi-plus</v-icon></v-btn>
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
          </span>
          <span v-if="player_round.round.state >= 2">
            <v-chip-group>
              <v-chip v-for="alliance in player_round.alliances" :key="alliance" size="small">
                <v-icon class="mr-2" v-if="player_round.round.is_current_round() && player_round.round.state == 2" left
                  @click="remove_alliance(alliance)">mdi-close-circle</v-icon>{{ alliance.player1.name + ' + ' +
                    alliance.player2.name }}
              </v-chip>
            </v-chip-group>
          </span>
        </v-col>
      </v-row>

      <!-- Bonuses -->
      <v-row class="pa-0 ma-0" v-if="player_round.round.state > 0">
        <v-col cols="12" class="pa-0 ma-0 px-1">
            <span style="display: flex;">
              <h3>Bonsues</h3>
              <v-dialog v-model="bonus_dialog"
                v-if="player_round.round.is_current_round() && player_round.round.state == 2">
                <template v-slot:activator="{ props }">
                  <v-btn class="mx-2" v-bind="props" size="x-small" @click="bonus_dialog = true"><v-icon>mdi-plus</v-icon></v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    Claim a Bonus for {{ player_round.player.name }}
                  </v-card-title>
                  <v-card-text>
                    <v-chip-group>
                      <v-chip v-for="bonus in available_capture_bonuses()" :key="bonus" @click="claim_bonus(bonus)"
                        size="small" :class="bonus_class(bonus)">
                        <v-icon v-if="bonus_icon(bonus)">{{ bonus_icon(bonus) }}</v-icon>
                        <span v-else>{{ bonus_text(bonus) }}</span> ( {{ bonus.count }})</v-chip>
                    </v-chip-group>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="blue-darken-1" variant="text" @click="bonus_dialog = false">
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </span>
          <span v-if="player_round.round.state >= 2">
            <v-chip-group>
              <v-chip v-for="(capture_bonus, index) in player_round.bonuses" :key="capture_bonus" size="small"
                :class="bonus_class(capture_bonus)"><v-icon class="mr-2"
                  v-if="player_round.round.is_current_round() && player_round.round.state == 2" left
                  @click="remove_bonus(capture_bonus, index)" size="small">mdi-close-circle</v-icon><v-icon
                  v-if="bonus_icon(capture_bonus)">{{ bonus_icon(capture_bonus) }}</v-icon><span v-else>{{
                    bonus_text(capture_bonus) }}</span><span class="pl-2">+{{ capture_bonus.points }} pts</span></v-chip>
            </v-chip-group>
          </span>
        </v-col>
      </v-row>
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
      bonus_dialog: false,
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
      if (this.bonus_dialog && e.key === 'Escape') {
        this.bonus_dialog = false;
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
      this.bonus_dialog = false;
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
    bonus_class(bonus) {
      if (bonus.name === 'Green 14') {
        return 'green-14';
      } else if (bonus.name === 'Yellow 14') {
        return 'yellow-14';
      } else if (bonus.name === 'Purple 14') {
        return 'purple-14';
      } else if (bonus.name === 'Black 14') {
        return 'black-14';
      } else if (bonus.name === 'Skull King') {
        return 'skull-king';
      } else if (bonus.name === 'Pirate') {
        return 'pirate';
      } else if (bonus.name === 'Mermaid') {
        return 'mermaid';
      }
      return '';
    },
    bonus_text(bonus) {
      if (bonus.name === 'Green 14') {
        return '14';
      } else if (bonus.name === 'Yellow 14') {
        return '14';
      } else if (bonus.name === 'Purple 14') {
        return '14';
      } else if (bonus.name === 'Black 14') {
        return '14';
      } else if (bonus.name === 'Skull King') {
        return 'SK';
      } else if (bonus.name === 'Pirate') {
        return 'P';
      } else if (bonus.name === 'Mermaid') {
        return 'M';
      }
      return '';
    },
    bonus_icon(bonus) {
      if (bonus.name === 'Skull King') {
        return 'mdi-crown';
      } else if (bonus.name === 'Pirate') {
        return 'mdi-pirate';
      } else if (bonus.name === 'Mermaid') {
        return 'mdi-face-woman-shimmer-outline';
      }
      return null;
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

.yellow-14 {
  background-color: yellow;
  color: black;
}

.green-14 {
  background-color: green;
  color: white;
}

.purple-14 {
  background-color: purple;
  color: white;
}

.black-14 {
  background-color: black;
  color: white;
}

.skull-king {
  background-color: black;
  color: white;
}

.pirate {
  background-color: red;
  color: white;
}

.mermaid {
  background-color: aqua;
  color: black;
}
</style>