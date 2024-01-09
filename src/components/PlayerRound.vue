<template>
    <v-card>
        <v-card-title>
            {{ player_round.player.name }}
        </v-card-title>
        <v-card-text>
        </v-card-text>
    </v-card>
</template>

<script>

export default {
    name: 'PlayerRound',
    //   components: {
    //     PlayerRound
    //   },
    props: {
        player_round: Object
    }
}
</script>
