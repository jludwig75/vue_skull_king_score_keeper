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


const SuitBonuses = {
    GREEN: { color: 'green', points: 10 },
    YELLOW: { color: 'yellow', points: 10 },
    PURPLE: { color: 'purple', points: 10 },
    BLACK: { color: 'black', points: 20 }
}

class PlayerRound {
    constructor(round, round_number, player) {
        this.round = round;
        this.round_number = round_number
        this.player = player;
        this.bonuses = []
        this.alliances = [];
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
        }
    }

    won_bid() {
        return this.tricks_won == this.tricks_bid;
    }

    get_score() {
        if (!('tricks_bid' in this) || !('tricks_won' in this)) {
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
}

class Round {
    constructor(round_number, players) {
        this.round_number = round_number
        this.player_rounds = [];
        for (const player of players) {
            this.player_rounds.push(new PlayerRound(this, round_number, player));
        }
        this.available_bonuses = [SuitBonuses.GREEN, SuitBonuses.YELLOW, SuitBonuses.PURPLE, SuitBonuses.BLACK];
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

        let round = new Round(this.rounds.length + 1, this.players);
        this.rounds.push(round);
        return round;
    }

    get_player_by_name(player_name) {
        for (const player of this.players) {
            if (player.name === player_name) {
                return player;
            }
        }

        return null;
    }
}

module.exports = { Game, Alliance, SuitBonuses };