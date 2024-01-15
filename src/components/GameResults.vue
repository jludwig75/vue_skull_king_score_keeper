<template>
  <v-card>
    <v-card-title>
      {{ results.results[0].player.name }} Wins!
    </v-card-title>
    <v-card-subtitle>
      Game Results
    </v-card-subtitle>
    <v-list>
      <v-list-item v-for="player_result in results.results" :key="player_result">
        <v-row>
          <v-col cols="1">
            {{ place_string(player_result.place) }}
          </v-col>
          <v-col cols="2">
            {{ player_result.player.name }}
          </v-col>
          <v-col cols="1">
            {{ player_result.score }}
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
    <v-card-text>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'GameResults',
  props: {
    results: Object,
  },
  methods: {
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
    },
  },
}
</script>
