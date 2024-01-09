const { Game, Alliance, CaptureBonuses } = require('./SkullKing');

test('Test basic game functionality', () => {
    let game = new Game();
    game.add_player("Joe");
    game.add_player("Mary");
    game.add_player("Sue");
    let round = game.start_next_round();

    player_joe = game.get_player_by_name("Joe");
    player_mary = game.get_player_by_name("Mary");
    player_sue = game.get_player_by_name("Sue");

    player_round_joe = round.get_player_round(player_joe);
    player_round_mary = round.get_player_round(player_mary);
    player_round_sue = round.get_player_round(player_sue);

    // Set tricks bid
    player_round_joe.set_tricks_bid(1);
    player_round_mary.set_tricks_bid(1);
    player_round_sue.set_tricks_bid(0);

    // Set tricks won
    player_round_joe.set_tricks_won(0);
    player_round_mary.set_tricks_won(1);
    player_round_sue.set_tricks_won(0);

    // Use expect() to check the results
    expect(player_round_joe.get_score()).toBe(-10);
    expect(player_round_mary.get_score()).toBe(20);
    expect(player_round_sue.get_score()).toBe(10);
});

test('Test more advanced game functionality', () => {
    let game = new Game();
    game.add_player("Joe");
    game.add_player("Mary");
    game.add_player("Sue");
    
    // Advance to the third round
    let round = game.start_next_round();
    round = game.start_next_round();
    round = game.start_next_round();

    player_joe = game.get_player_by_name("Joe");
    player_mary = game.get_player_by_name("Mary");
    player_sue = game.get_player_by_name("Sue");

    player_round_joe = round.get_player_round(player_joe);
    player_round_mary = round.get_player_round(player_mary);
    player_round_sue = round.get_player_round(player_sue);

    // Set tricks bid
    player_round_joe.set_tricks_bid(2);
    player_round_mary.set_tricks_bid(2);
    player_round_sue.set_tricks_bid(0);

    // Set tricks won
    player_round_joe.set_tricks_won(1);
    player_round_mary.set_tricks_won(2);
    player_round_sue.set_tricks_won(0);

    // Use expect() to check the results
    expect(player_round_joe.get_score()).toBe(-10);
    expect(player_round_mary.get_score()).toBe(40);
    expect(player_round_sue.get_score()).toBe(30);

    
    // Add bonuses
    player_round_joe.add_bonus(CaptureBonuses.GREEN_14);
    player_round_mary.add_bonus(CaptureBonuses.YELLOW_14);
    player_round_sue.add_bonus(CaptureBonuses.BLACK_14);
    expect(player_round_joe.get_score()).toBe(-10);
    expect(player_round_mary.get_score()).toBe(50);
    expect(player_round_sue.get_score()).toBe(50);

    // Add an alliance
    let alliance = new Alliance(player_mary, player_sue);
    player_round_sue.add_alliance(alliance);
    player_round_mary.add_alliance(alliance);

    expect(player_round_joe.get_score()).toBe(-10);
    expect(player_round_mary.get_score()).toBe(70);
    expect(player_round_sue.get_score()).toBe(70);
});