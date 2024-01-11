class Player {
    constructor(name) {
        this.name = name;
    }

    static deserialize(player_data) {
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

    static deserialize(alliance_json, gane) {
        let alliance_data = JSON.parse(alliance_json);
        // console.log('Deserializing alliance: ' + JSON.stringify(alliance_data));
        let player1 = gane.get_player_by_name(alliance_data.player1_name);
        if (!player1) {
            console.error('Could not find player with name ' + alliance_data.player1_name);
        }
        let player2 = gane.get_player_by_name(alliance_data.player2_name);
        if (!player2) {
            console.error('Could not find player with name ' + alliance_data.player2_name);
        }
        return new Alliance(
            player1,
            player2,
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

    matches(other) {
        return this.player1 == other.player1 && this.player2 == other.player2;
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
    GREEN_14: { name: 'Green 14', points: 10, count: 1 },
    YELLOW_14: { name: 'Yellow 14', points: 10, count: 1 },
    PURPLE_14: { name: 'Purple 14', points: 10, count: 1 },
    BLACK_14: { name: 'Black 14', points: 20, count: 1 },
    SKULL_KING: { name: 'Skull King', points: 20, count: 1 },
    PIRATE: { name: 'Pirate', points: 20, count: 6 },
    MERMAID: { name: 'Mermaid', points: 20, count: 2 }
}

function bonuses_are_equal(bonus1, bonus2) {
    return bonus1.name == bonus2.name && bonus1.points == bonus2.points;

}

const AllCaptureBonsues = [CaptureBonuses.GREEN_14, CaptureBonuses.YELLOW_14, CaptureBonuses.PURPLE_14, CaptureBonuses.BLACK_14, CaptureBonuses.SKULL_KING, CaptureBonuses.MERMAID, CaptureBonuses.PIRATE]

class CapturedBonus {
    constructor(bonus) {
        this.name = bonus.name;
        this.points = bonus.points;
    }

    static deserialize(json) {
        // console.log('Deserializing CapturedBons JSON ' + json);
        let data = JSON.parse(json);
        return new AvailableBonus(data);
    }

    serialize() {
        return JSON.stringify(this);
    }

    matches(other) {
        // console.log('CapturedBonus comparing ' + JSON.stringify(this) + ' to ' + JSON.stringify(other));
        return this.name === other.name && this.points === other.points;
    }
}


class PlayerRound {
    constructor(round, round_number, player) {
        this.round = round;
        this.round_number = round_number
        this.player = player;
        this.bonuses = [];
        this.alliances = [];
        this.tricks_bid = null;
        this.tricks_won = null;
    }

    static deserialize(player_round_json, round) {
        let player_round_data = JSON.parse(player_round_json);
        let player = round.game.get_player_by_name(player_round_data.player_name)
        let player_round = new PlayerRound(round, player_round_data.round_number, player);
        player_round.tricks_bid = player_round_data.tricks_bid;
        player_round.tricks_won = player_round_data.tricks_won;
        // console.log('Deserializing ' + player.name + '\'s alliances: ' + JSON.stringify(player_round_data.alliances));
        for (const alliance_data of player_round_data.alliances) {
            // console.log('Deserializing an alliance for ' + player.name + ': ' + JSON.stringify(alliance_data));
            player_round.alliances.push(Alliance.deserialize(alliance_data, round.game));
        }
        for (const bonus of player_round_data.bonuses) {
            player_round.bonuses.push(CapturedBonus.deserialize(bonus));
        }
        // console.log('this.available_bonuses: ' + JSON.stringify(this.available_bonuses));
        // console.log('Complete deserialized player_round for ' + player.name + ': ' + player_round.serialize(false));
        return player_round
    }

    serialize(/*print_to_console = true*/) {
        let alliances = [];
        for (const alliance of this.alliances) {
            alliances.push(alliance.serialize());
        }
        let captured_bonuses = [];
        for (const captured_bonus of this.bonuses) {
            captured_bonuses.push(captured_bonus.serialize());
        }
        let serialized_json = JSON.stringify({
            round_number: this.round_number,
            player_name: this.player.name,
            bonuses: captured_bonuses,
            alliances: alliances,
            tricks_bid: this.tricks_bid,
            tricks_won: this.tricks_won,
        });
        // if (print_to_console) {
        //     console.log('Complete serialized player_round for ' + this.player.name + ': ' + serialized_json);
        // }
        return serialized_json;
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
        // console.log('Comparing ' + number_of_bonuses + ' bonuses. this: ' + JSON.stringify(this.bonuses) + ' other: ' + JSON.stringify(other.bonuses));
        for (let i = 0; i < number_of_bonuses; i++) {
            if (!bonuses_are_equal(this.bonuses[i], other.bonuses[i])) {
                console.error('Bonus does not match. this.bonuses[i]: ' + JSON.stringify(this.bonuses[i]) + ' other: ' + JSON.stringify(other.bonuses[i]));
                return false;
            }
        }

        // Compare the scores
        if (this.get_score() !== other.get_score()) {
            console.error(this.player.name + '\'s score does not match. this.get_score(): ' + this.get_score(), ' other.get_score(): ' + other.get_score());
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
        let remove_alliance = () => {
            let index = this.alliances.indexOf(alliance);
            if (index != -1) {
                this.alliances.splice(index, 1);
            }
        };

        let other_player = alliance.get_other_player(this.player);
        if (!other_player) {
            console.error('Failed to get other player');
            remove_alliance();
            return false;
        }
        let other_player_round = this.round.get_player_round(other_player);
        if (!other_player_round) {
            console.error('Failed to get other player round');
            remove_alliance();
            return false;
        }

        other_player_round.alliances.push(alliance);
        return true;
    }

    remove_alliance(alliance) {
        let alliance_index = this.alliances.indexOf(alliance);
        if (alliance_index == -1) {
            return false;
        }
        this.alliances.splice(alliance_index, 1);

        let other_player = alliance.get_other_player(this.player);
        if (!other_player) {
            console.error('Failed to get other player');
            return false;
        }
        let other_player_round = this.round.get_player_round(other_player);
        if (!other_player_round) {
            console.error('Failed to get other player round');
            return false;
        }

        alliance_index = other_player_round.alliances.findIndex((found_alliance) => alliance.matches(found_alliance));
        if (alliance_index != -1) {
            other_player_round.alliances.splice(alliance_index, 1);
        }
    }

    claim_bonus(bonus) {
        let bonus_to_claim = this.round.claim_bonus(bonus);
        if (bonus_to_claim) {
            this.bonuses.push(new CapturedBonus(bonus_to_claim));
        } // else handle error
    }

    relinquish_bonus(bonus, index = null) {
        // console.log('relinquish_bonus(' + JSON.stringify(bonus) + ',' + index + ')')
        var bonus_index = null;
        if (index == null) {
            bonus_index = this.bonuses.findIndex(found_bonus => found_bonus.name === bonus.name);
        } else {
            if (index >= this.bonuses.length || !bonus.matches(this.bonuses[index])) {
                console.error("Bonus at index does not match");
                return;
            }
            bonus_index = index;
        }
        if (bonus_index != -1) {
            // console.log("Removing bonus at index " + bonus_index);
            this.bonuses.splice(bonus_index, 1);
            this.round.return_bonus(bonus);
            // console.log('Bonuses after relinquish ' + JSON.stringify(this.bonuses));
        } // else handle error
    }

    bid_placed() {
        return this.tricks_bid != null;
    }

    won_bid() {
        return this.tricks_won == this.tricks_bid;
    }

    get_score() {
        // console.log('Calcualting round score for ' + this.player.name);
        if (this.tricks_bid == null || this.tricks_won == null) {
            // console.warn('Score is null because tricks_bid or tricks_won is null');
            return null;
        }
        let score = 0;

        // console.log('Calcualting tricks score for ' + this.player.name);
        if (this.tricks_won == this.tricks_bid) {
            if (this.tricks_bid == 0) {
                score += this.round_number * 10;
            } else {
                score += this.tricks_bid * 20;
            }
        } else {
            score -= Math.abs(this.tricks_won - this.tricks_bid) * 10;
        }
        // console.log('Tricks score for ' + this.player.name + ': ' + score);

        if (this.won_bid()) {
            // console.log(this.player.name + ' won their tricks bid. Adding bonuses...');
            // Handle bonuses
            for (const bonus of this.bonuses) {
                score += bonus.points;
            }
            // console.log('Tricks+bonues score for ' + this.player.name + ': ' + score);

            // console.log('Calculating ' + this.player.name + '\'s alliance score...');
            // Handle alliances
            // console.log(this.player.name + ' has ' + this.alliances.length + ' alliances');
            for (const alliance of this.alliances) {
                let other_player = alliance.get_other_player(this.player);
                // console.log('Evaluating alliance between ' + this.player.name + ' and ' + other_player.name);
                if (other_player) {
                    let other_player_round = this.round.get_player_round(other_player);
                    if (other_player_round) {
                        if (other_player_round.won_bid()) {
                            score += 20;
                        }
                    } // else handle error
                } // else handle error
            }
            // console.log('Tricks+bonues+alliances score for ' + this.player.name + ': ' + score);
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

class AvailableBonus {
    constructor(bonus) {
        this.name = bonus.name;
        this.points = bonus.points;
        this.count = bonus.count;
    }

    static deserialize(json) {
        let data = JSON.parse(json);
        return new AvailableBonus(data);
    }

    serialize() {
        return JSON.stringify(this);
    }

    matches(other) {
        // console.log('AvailableBonus comparing ' + JSON.stringify(this) + ' to ' + JSON.stringify(other));
        return this.name === other.name && this.points === other.points;
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
        this.available_bonuses = AllCaptureBonsues.map(bonus => new AvailableBonus(bonus));
        // console.log('this.available_bonuses: ' + JSON.stringify(this.available_bonuses));
        this.state = RoundState.NEW;
    }

    static deserialize(round_json, game) {
        let round_data = JSON.parse(round_json);
        let new_round = new Round(game, round_data.round_number, game.players);
        new_round.state = round_data.state;

        // This array was initialized by the constructor. Clear it now.
        new_round.available_bonuses = [];
        for (const available_bonus_data of round_data.available_bonuses) {
            new_round.available_bonuses.push(AvailableBonus.deserialize(available_bonus_data));
        }

        // This array was initialized by the constructor. Clear it now.
        new_round.player_rounds = [];
        // let i = 0;
        for (const player_round_data of round_data.player_rounds) {
            // console.log('Deserialzing player_round ' + i);
            // i++;
            new_round.player_rounds.push(PlayerRound.deserialize(player_round_data, new_round));
        }

        return new_round;
    }

    serialize() {
        let player_rounds = [];
        for (const player_round of this.player_rounds) {
            player_rounds.push(player_round.serialize())
        }
        let available_bonuses = [];
        for (const available_bonus of this.available_bonuses) {
            available_bonuses.push(available_bonus.serialize());
        }
        return JSON.stringify({
            round_number: this.round_number,
            player_rounds: player_rounds,
            available_bonuses: available_bonuses,
            state: this.state,
        });
    }

    is_independent_clone_of(other, my_game) {
        if (other == null || other == this) {
            // console.error('Null or duplicate round' + other);
            return false;
        }

        let number_of_bonuses = this.available_bonuses.length;
        if (number_of_bonuses != other.available_bonuses.length) {
            console.error('Number of available bonuses does not match. this.available_bonuses.length: ' + this.available_bonuses.length + ' other.available_bonuses.length: ' + other.available_bonuses.length)
            return false;
        }
        // console.log('Comparing ' + number_of_bonuses + ' available bonuses. this: ' + JSON.stringify(this.available_bonuses) + ' other: ' + JSON.stringify(other.available_bonuses));
        for (let i = 0; i < number_of_bonuses; i++) {
            if (!bonuses_are_equal(this.available_bonuses[i], other.available_bonuses[i])) {
                console.error('available_bonuse does not match. this.available_bonuses[i]: ' + this.available_bonuses[i] + ' other.available_bonuses[i]: ' + other.available_bonuses[i])
                return false;
            }
        }

        let number_of_rounds = this.player_rounds.length;
        if (number_of_rounds != other.player_rounds.length) {
            // console.error('Number of player_rounds does not match. this.player_rounds.length: ' + this.player_rounds.length + ' other.player_rounds.length: ' + other.player_rounds.length)
            return false
        }
        // console.log('Comparing ' + number_of_rounds + ' player rounds');
        for (let i = 0; i < number_of_rounds; i++) {
            // console.log('Comparing player_round ' + i + '. this: ' + this.player_rounds[i].serialize(false) + ' other: ' + other.player_rounds[i].serialize(false));
            if (!(this.player_rounds[i].is_independent_clone_of(other.player_rounds[i], this))) {
                console.error('player_rounds do not match. this.player_rounds[i]: ' + this.player_rounds[i].serialize(false) + ' other.player_rounds[i]: ' + other.player_rounds[i].serialize(false))
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
        // console.log('Attempting to claim bonus ' + JSON.stringify(bonus) + ' from ' + JSON.stringify(this.available_bonuses))
        let bonus_index = this.available_bonuses.findIndex(found_bonus => found_bonus.matches(bonus));
        if (bonus_index === -1) {
            console.warn('Unexpectedly count not find available bonus');
            return null;
        }
        if (this.available_bonuses[bonus_index].count == 0) {
            console.warn('Cannot claim bonus that is no longer available');
            return null;
        }
        // Decrement the available bonus count
        this.available_bonuses[bonus_index].count--;
        return bonus;
    }

    return_bonus(bonus) {
        // See if the bonus is available
        // console.log('Attempting to return bonus ' + JSON.stringify(bonus) + ' from ' + JSON.stringify(this.available_bonuses))
        let bonus_index = this.available_bonuses.findIndex(found_bonus => found_bonus.matches(bonus));
        if (bonus_index === -1) {
            console.warn('Unexpectedly count not find available bonus');
            return null;
        }
        this.available_bonuses[bonus_index].count++;
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
            game.players.push(Player.deserialize(player_data));
        }

        for (const round_data of game_data.rounds) {
            game.rounds.push(Round.deserialize(round_data, game));
        }

        return game;
    }

    serialize() {
        // console.log('BEGIN SERIALIZE GAME');
        let serialized_rounds = [];
        for (const round of this.rounds) {
            serialized_rounds.push(round.serialize());
        }
        let game_data = { players: this.players, rounds: serialized_rounds };

        // console.log('END SERIALIZE GAME');
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
            // console.log('Comparing players. this: ' + this.players[i].serialize(false) + ' other: ' + other.players[i].serialize(false));
            if (!this.players[i].is_independent_clone_of(other.players[i], this)) {
                return false;
            }
        }

        let number_of_rounds = this.rounds.length;
        if (number_of_rounds != other.rounds.length) {
            return false;
        }
        for (let i = 0; i < number_of_rounds; i++) {
            // console.log('Comparing round ' + i);
            if (!this.rounds[i].is_independent_clone_of(other.rounds[i], this)) {
                console.error(
                    'Games rounds do not match. this: ' + this.rounds[i].serialize(false) + ' other: ' + other.rounds[i].serialize(false)
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