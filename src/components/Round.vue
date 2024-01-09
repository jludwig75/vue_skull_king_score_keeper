<template>
    <div v-if="round != null">
        Round {{ round.round_number }}
        <PlayerRound v-for="player_round in round.player_rounds" :key="player_round" :player_round="player_round" />
    </div>
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
