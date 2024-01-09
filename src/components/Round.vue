<template>
    <v-card v-if="round != null">
        <v-card-title>
            Round {{ round.round_number }}
        </v-card-title>
        <v-card-text>
            <PlayerRound v-for="player_round in round.player_rounds" :key="player_round" :player_round="player_round" />
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
    }
}
</script>
