<template>
    <div>
        {{ player_round.player.name }}
    </div>
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
