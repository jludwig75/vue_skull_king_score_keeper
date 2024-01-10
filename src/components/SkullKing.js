class Player {
    constructor(name) {
        this.name = name;
    }

    static desrialize(player_data) {
        return new Player(player_data.name);
    }

    serialize() {
        return JSON.stringify(this);
    }

    is_independent_clone_of(other, my_game) {
        if (other == null || other == this) {
            console.error('Null or duplicate player ' + other);
            return false;
        }

        return other.name === this.name
            && my_game.get_player_by_name(this.name) == this
            ;
    }
}

class Alliance {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
    }

    static desrialize(alliance_data, gane) {
        return new Alliance(
            gane.get_player_by_name(alliance_data.player1_name),
            gane.get_player_by_name(alliance_data.player2_name),
        );
    }

    serialize() {
        return JSON.stringify({
            player1_name: this.player1.name,
            player2_name: this.player2.name,
        });
    }

    is_independent_clone_of(other, my_game) {
        if (other == null || other == this) {
            console.error('Null or duplicate alliance ' + other);
            return false;
        }

        if (this.player1 && this.player1.name != other.player1.name) {
            console.error('Mismatched players in alliance. this.player1.name: ' + this.player1.name + ' other.player1.name: ' + other.player1.name);
            return false;
        }

        if (this.player2 && this.player2.name != other.player2.name) {
            console.error('Mismatched players in alliance. this.player2.name: ' + this.player2.name + ' other.player1.name: ' + other.player2.name);
            return false;
        }

        if (this.player1 != my_game.get_player_by_name(this.player1.namne)) {
            console.error('Errant player1 in alliance ' + this.player1);
            return false;
        }

        if (this.player2 != my_game.get_player_by_name(this.player2.namne)) {
            console.error('Errant player2 in alliance ' + this.player2);
            return false;
        }

        return true;
    }

    get_other_player(this_player) {
        if (this_player == this.player1) {
            return this.player2;
        }
        if (this_player == this.player2) {
            return this.player1;
        }

        return null;
    }
}


const CaptureBonuses = {
    GREEN_14: { name: 'Green 14', points: 10 },
    YELLOW_14: { name: 'Yellow 14', points: 10 },
    PURPLE_14: { name: 'Purple 14', points: 10 },
    BLACK_14: { name: 'Black 14', points: 20 },
    SKULL_KING: { name: 'Skull King', points: 20 },
    PIRATE: { name: 'Pirate', points: 20 },
    MERMAID: { name: 'Mermaid', points: 20 }
}

function bonuses_are_equal(bonus1, bonus2) {
    return bonus1.name == bonus2.name && bonus1.points == bonus2.points;

}

const AllCaptureBonsues = [CaptureBonuses.GREEN_14, CaptureBonuses.YELLOW_14, CaptureBonuses.PURPLE_14, CaptureBonuses.BLACK_14, CaptureBonuses.SKULL_KING, CaptureBonuses.MERMAID, CaptureBonuses.PIRATE]

class PlayerRound {
    constructor(round, round_number, player) {
        this.round = round;
        this.round_number = round_number
        this.player = player;
        this.bonuses = []
        this.alliances = [];
        this.tricks_bid = null;
        this.tricks_won = null;
    }

    static desrialize(player_round_json, round) {
        let player_round_data = JSON.parse(player_round_json);
        let player = round.game.get_player_by_name(player_round_data.player_name)
        let player_round = new PlayerRound(round, player_round_data.round_number, player);
        player_round.bonuses = player_round_data.bonuses.slice();
        player_round.tricks_bid = player_round_data.tricks_bid;
        player_round.tricks_won = player_round_data.tricks_won;
        for (const alliance_data of player_round_data.alliances) {
            player_round.alliances.push(Alliance.desrialize(alliance_data, round.game));
        }
        return player_round
    }

    serialize() {
        return JSON.stringify({
            round_number: this.round_number,
            player_name: this.player.name,
            bonuses: this.bonuses,
            alliances: this.alliances,
            tricks_bid: this.tricks_bid,
            tricks_won: this.tricks_won,
        });
    }

    is_independent_clone_of(other, my_round) {
        if (other == null || other == this) {
            console.error('Null or duplicate player_round');
            return false;
        }

        let number_of_bonuses = this.bonuses.length;
        if (number_of_bonuses != other.bonuses.length) {
            console.error('Nunber of bonuses does not match');
            return false
        }
        console.log('Comparing ' + number_of_bonuses + ' bonuses. this: ' + JSON.stringify(this.bonuses) + ' other: ' + JSON.stringify(other.bonuses));
        for (let i = 0; i < number_of_bonuses; i++) {
            if (!bonuses_are_equal(this.bonuses[i], other.bonuses[i])) {
                console.error('Bonus does not match. this.bonuses[i]: ' + JSON.stringify(this.bonuses[i]) + ' other: ' + JSON.stringify(other.bonuses[i]));
                return false;
            }
        }

        // Compare the scores
        if (this.get_score() != other.get_score()) {
            console.error('Score does not match');
            return false;
        }

        if (this.get_cumulative_score() != other.get_cumulative_score()) {
            console.error('Cumulative score does not match');
            return false;
        }

        return this.round_number === other.round_number
            && this.player.name == other.player.name
            && this.tricks_bid == other.tricks_bid
            && this.tricks_won == other.tricks_won
            && this.round == my_round
            && this.round != other.round
            ;
    }

    set_tricks_bid(tricks_bid) {
        this.tricks_bid = tricks_bid;
    }

    set_tricks_won(tricks_won) {
        this.tricks_won = tricks_won;
    }

    add_alliance(alliance) {
        this.alliances.push(alliance);
    }

    claim_bonus(bonus) {
        let bonus_to_claim = this.round.claim_bonus(bonus);
        if (bonus_to_claim) {
            this.bonuses.push(bonus_to_claim);
        } // else handle error
    }

    relinquish_bonus(bonus) {
        let bonus_index = this.bonuses.indexOf(bonus);
        if (bonus_index != -1) {
            this.bonuses.splice(bonus_index, 1);
            this.round.return_bonus(bonus);
        } // else handle error
    }

    bid_placed() {
        return this.tricks_bid != null;
    }

    won_bid() {
        return this.tricks_won == this.tricks_bid;
    }

    get_score() {
        if (this.tricks_bid == null || this.tricks_won == null) {
            return null;
        }
        let score = 0;

        if (this.tricks_won == this.tricks_bid) {
            if (this.tricks_bid == 0) {
                score += this.round_number * 10;
            } else {
                score += this.tricks_bid * 20;
            }
        } else {
            score -= Math.abs(this.tricks_won - this.tricks_bid) * 10;
        }

        if (this.won_bid()) {
            // Handle bonuses
            for (const bonus of this.bonuses) {
                score += bonus.points;
            }

            // Handle alliances
            for (const alliance of this.alliances) {
                let other_player = alliance.get_other_player(this.player);
                if (other_player) {
                    let other_player_round = this.round.get_player_round(other_player);
                    if (other_player_round) {
                        if (other_player_round.won_bid()) {
                            score += 20;
                        }
                    } // else handle error
                } // else handle error
            }
        }

        return score;
    }

    get_cumulative_score() {
        let round_score = this.get_score();
        if (round_score == null) {
            return null;
        }


        let previous_round = this.get_previous_player_round();
        if (previous_round) {
            return previous_round.get_cumulative_score() + round_score;
        }

        return round_score;
    }

    get_previous_player_round() {
        let previous_round = this.round.get_previous_round();
        if (!previous_round) {
            return null;
        }

        return previous_round.get_player_round(this.player);
    }
}

const RoundState = {
    NEW: 0,
    BIDDING: 1,
    SCORING: 2,
    COMPLETE: 3,
}

class Round {
    constructor(game, round_number, players) {
        this.game = game
        this.round_number = round_number
        this.player_rounds = [];
        for (const player of players) {
            this.player_rounds.push(new PlayerRound(this, round_number, player));
        }
        this.available_bonuses = AllCaptureBonsues.slice();
        this.state = RoundState.NEW;
    }

    static desrialize(round_json, game) {
        let round_data = JSON.parse(round_json);
        let new_round = new Round(game, round_data.round_number, game.players);
        new_round.state = round_data.state;
        new_round.available_bonuses = round_data.available_bonuses;
        // This array was initialized by the constructor. Clear it now.
        new_round.player_rounds = [];
        let i = 0;
        for (const player_round_data of round_data.player_rounds) {
            console.log('Deserialzing player_round ' + i);
            i++;
            new_round.player_rounds.push(PlayerRound.desrialize(player_round_data, new_round));
        }

        return new_round;
    }

    serialize() {
        let player_rounds = [];
        for (const player_round of this.player_rounds) {
            player_rounds.push(player_round.serialize())
        }
        return JSON.stringify({
            round_number: this.round_number,
            player_rounds: player_rounds,
            available_bonuses: this.available_bonuses,
            state: this.state,
        });
    }

    is_independent_clone_of(other, my_game) {
        if (other == null || other == this) {
            console.error('Null or duplicate round' + other);
            return false;
        }

        let number_of_bonuses = this.available_bonuses.length;
        if (number_of_bonuses != other.available_bonuses.length) {
            console.error('Number of available bonuses does not match. this.available_bonuses.length: ' + this.available_bonuses.length + ' other.available_bonuses.length: ' + other.available_bonuses.length)
            return false;
        }
        console.log('Comparing ' + number_of_bonuses + ' available bonuses. this: ' + JSON.stringify(this.available_bonuses) + ' other: ' + JSON.stringify(other.available_bonuses));
        for (let i = 0; i < number_of_bonuses; i++) {
            if (!bonuses_are_equal(this.available_bonuses[i], other.available_bonuses[i])) {
                console.error('available_bonuse does not match. this.available_bonuses[i]: ' + this.available_bonuses[i] + ' other.available_bonuses[i]: ' + other.available_bonuses[i])
                return false;
            }
        }

        let number_of_rounds = this.player_rounds.length;
        if (number_of_rounds != other.player_rounds.length) {
            console.error('Number of player_rounds does not match. this.player_rounds.length: ' + this.player_rounds.length + ' other.player_rounds.length: ' + other.player_rounds.length)
            return false
        }
        console.log('Comparing ' + number_of_rounds + ' player rounds');
        for (let i = 0; i < number_of_rounds; i++) {
            console.log('Comparing player_round ' + i + '. this: ' + this.player_rounds[i].serialize() + ' other: ' + other.player_rounds[i].serialize());
            if (!(this.player_rounds[i].is_independent_clone_of(other.player_rounds[i], this))) {
                console.error('player_rounds do not match. this.player_rounds[i]: ' + this.player_rounds[i].serialize() + ' other.player_rounds[i]: ' + other.player_rounds[i].serialize())
                return false;
            }
        }

        return this.round_number === other.round_number
            && this.state === other.state
            && this.game == my_game
            && this.game != other.game
            ;
    }

    start() {
        if (this.state != RoundState.NEW) {
            return false;
        }

        this.state = RoundState.BIDDING;
        return true;
    }

    start_playing() {
        if (this.state != RoundState.BIDDING || !this.all_bids_placed()) {
            return false;
        }

        this.state = RoundState.SCORING;
        return true;
    }

    end() {
        if (this.state != RoundState.SCORING || !this.all_tricks_won_set()) {
            return false;
        }

        this.state = RoundState.COMPLETE;
        return true;
    }

    is_current_round() {
        return this.game.get_current_round() == this;
    }

    all_bids_placed() {
        for (const player_round of this.player_rounds) {
            if (!player_round.bid_placed()) {
                return false;
            }
        }
        return true;
    }

    claim_bonus(bonus) {
        // See if the bonus is available
        if (this.available_bonuses.includes(bonus)) {
            let bonus_index = this.available_bonuses.indexOf(bonus);
            if (bonus_index !== -1) {
                // Remove the bonus from the available bonus list
                this.available_bonuses.splice(bonus_index, 1);
                return bonus;
            } // else handle error
        }

        return null;
    }

    return_bonus(bonus) {
        if (!this.available_bonuses.includes(bonus)) {
            this.available_bonuses.push(bonus);
        } // else handle error
    }

    get_player_round(player) {
        for (const player_round of this.player_rounds) {
            if (player_round.player == player) {
                return player_round;
            }
        }
        return null;
    }

    all_tricks_won_set() {
        for (const player_round of this.player_rounds) {
            if (player_round.get_score() == null) {
                return false;
            }
        }

        return true;
    }

    get_previous_round() {
        if (this.round_number <= 1) {
            return null;
        }

        return this.game.get_round(this.round_number - 1);
    }

    total_bonuses_claimed() {
        return AllCaptureBonsues.length - this.available_bonuses.length;
    }

    total_tricks_won() {
        let tricks_won = 0;
        for (const player_round of this.player_rounds) {
            tricks_won += player_round.tricks_won;
        }
        return tricks_won;
    }
}

class Game {
    constructor() {
        this.players = [];
        this.rounds = [];
    }

    static deserialize(data_json) {
        let game_data = JSON.parse(data_json);
        let game = new Game();

        // Deserialize players first so other objects
        // can look up layers by name.
        for (const player_data of game_data.players) {
            game.players.push(Player.desrialize(player_data));
        }

        for (const round_data of game_data.rounds) {
            game.rounds.push(Round.desrialize(round_data, game));
        }

        return game;
    }

    serialize() {
        let serialized_rounds = [];
        for (const round of this.rounds) {
            serialized_rounds.push(round.serialize());
        }
        let game_data = { players: this.players, rounds: serialized_rounds };

        return JSON.stringify(game_data);
    }

    is_independent_clone_of(other) {
        if (other == null || other == this) {
            return false;
        }

        let number_of_players = this.players.length;
        if (number_of_players != other.players.length) {
            return false;
        }
        for (let i = 0; i < number_of_players; i++) {
            console.log('Comparing players. this: ' + this.players[i].serialize() + ' other: ' + other.players[i].serialize());
            if (!this.players[i].is_independent_clone_of(other.players[i], this)) {
                return false;
            }
        }

        let number_of_rounds = this.rounds.length;
        if (number_of_rounds != other.rounds.length) {
            return false;
        }
        for (let i = 0; i < number_of_rounds; i++) {
            console.log('Comparing round ' + i);
            if (!this.rounds[i].is_independent_clone_of(other.rounds[i], this)) {
                console.error(
                    'Games rounds do not match. this: ' + this.rounds[i].serialize() + ' other: ' + other.rounds[i].serialize()
                );
                return false;
            }
        }

        return true;
    }

    has_been_modified() {
        return this.players.length > 0 || this.rounds.length > 0;
    }

    add_player(player_name) {
        this.players.push(new Player(player_name))
    }

    start_next_round() {
        if (this.rounds.length >= 10) {
            return null;
        }

        let round = new Round(this, this.rounds.length + 1, this.players);
        this.rounds.push(round);
        return round;
    }

    get_current_round() {
        if (this.rounds.length == 0) {
            return null;
        }

        return this.rounds[this.rounds.length - 1];
    }

    get_round(round_number) {
        if (round_number <= 0 || round_number > this.rounds.length) {
            return null;
        }

        return this.rounds[round_number - 1];
    }

    get_player_by_name(player_name) {
        for (const player of this.players) {
            if (player.name === player_name) {
                return player;
            }
        }

        return null;
    }

    can_start_new_round() {
        if (this.players.length < 2) {
            return false;
        }
        if (this.rounds.length == 10) {
            return false;
        }
        if (this.rounds.length == 0) {
            return true;
        } else {
            let current_round = this.get_current_round();
            if (current_round) {
                return current_round.state == RoundState.COMPLETE;
            } // else handle error
        }
        return false;
    }
}

module.exports = { Game, Alliance, CaptureBonuses, RoundState };