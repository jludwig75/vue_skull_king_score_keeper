<template>
</template>

<script>
export default {
  name: 'GameRound',
  props: {

  },
  data() {
    return {
      game: new Game()
    };
  },
  created() {
    this.game.add_player("Joe");
    this.game.add_player("Mary");
    this.game.add_player("Sue");
  }
}
</script>
