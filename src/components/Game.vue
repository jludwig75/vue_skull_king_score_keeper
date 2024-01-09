<template>
  <div class="game">
    <h3>Players</h3>
    <ul>
      <li v-for="player in game.players" :key="player">{{ player.name }}</li>
    </ul>
    <div>
      <Round v-for="round in game.rounds" :key="round" :round="round" />
    </div>
  </div>
</template>

<script>
import { Game } from './SkullKing.js'
import Round from './Round.vue'

export default {
  name: 'SkullKingGame',
  components: {
    Round
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
    this.game.start_next_round();
    this.game.start_next_round();
    this.game.start_next_round();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}</style>
