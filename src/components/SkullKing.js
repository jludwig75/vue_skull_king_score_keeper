class Player {
    constructor(name) {
        this.name = name;
    }
}

class Alliance {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
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

    set_tricks_bid(tricks_bid) {
        this.tricks_bid = tricks_bid;
    }

    set_tricks_won(tricks_won) {
        this.tricks_won = tricks_won;
    }

    add_alliance(alliance) {
        this.alliances.push(alliance);
    }

    add_bonus(bonus) {
        let bonus_to_claim = this.round.claim_bonus(bonus);
        if (bonus_to_claim) {
            this.bonuses.push(bonus_to_claim);
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

    get_accumulative_score() {
        let round_score = this.get_score();
        if (round_score == null) {
            return null;
        }


        let previous_round = this.get_previous_player_round();
        if (previous_round) {
            return previous_round.get_accumulative_score() + round_score;
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
    BIDDING: 0,
    SCORING: 1,
    COMPLETE: 2,
}

class Round {
    constructor(game, round_number, players) {
        this.game = game
        this.round_number = round_number
        this.player_rounds = [];
        for (const player of players) {
            this.player_rounds.push(new PlayerRound(this, round_number, player));
        }
        this.available_bonuses = [CaptureBonuses.GREEN_14, CaptureBonuses.YELLOW_14, CaptureBonuses.PURPLE_14, CaptureBonuses.BLACK_14];
        this.state = RoundState.BIDDING;
    }

    start() {
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
}

class Game {
    constructor() {
        this.players = [];
        this.rounds = [];
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