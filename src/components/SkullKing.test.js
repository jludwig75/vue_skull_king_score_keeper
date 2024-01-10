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
    player_round_joe.claim_bonus(CaptureBonuses.GREEN_14);
    player_round_mary.claim_bonus(CaptureBonuses.YELLOW_14);
    player_round_sue.claim_bonus(CaptureBonuses.BLACK_14);
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

function validate_serialization_and_deserialization(game) {
    let game_json = game.serialize();
    let deserialized_game = Game.deserialize(game_json);
    return deserialized_game.is_independent_clone_of(game);
}

test('Test game serialization and deserialization', () => {
    // Create a new game and add players
    let game = new Game();
    game.add_player("Joe");
    game.add_player("Mary");
    game.add_player("Sue");

    // Test serialization and desrialization
    expect(validate_serialization_and_deserialization(game)).toBe(true);

    // Start round 1
    let round1 = game.start_next_round();

    // Test serialization and desrialization
    expect(validate_serialization_and_deserialization(game)).toBe(true);

    // Start the round
    round1.start();

    // Test serialization and desrialization
    expect(validate_serialization_and_deserialization(game)).toBe(true);

    // Make bids
    let joe = game.get_player_by_name("Joe");
    expect(joe).not.toBe(null);
    let mary = game.get_player_by_name("Mary");
    expect(mary).not.toBe(null);
    let sue = game.get_player_by_name("Sue");
    expect(sue).not.toBe(null);

    // Test serialization and desrialization
    expect(validate_serialization_and_deserialization(game)).toBe(true);

    let joes_round = round1.get_player_round(joe);
    expect(joes_round).not.toBe(null);

    let marys_round = round1.get_player_round(mary);
    expect(marys_round).not.toBe(null);

    let sues_round = round1.get_player_round(sue);
    expect(sues_round).not.toBe(null);

    joes_round.set_tricks_bid(0);
    marys_round.set_tricks_bid(0);
    sues_round.set_tricks_bid(1);

    // Test serialization and desrialization
    expect(validate_serialization_and_deserialization(game)).toBe(true);

    // End bidding
    round1.start_playing();

    // Test serialization and desrialization
    expect(validate_serialization_and_deserialization(game)).toBe(true);

    // Set tricks_won
    joes_round.set_tricks_won(0);
    marys_round.set_tricks_won(0);
    sues_round.set_tricks_won(1);

    // Test serialization and desrialization
    expect(validate_serialization_and_deserialization(game)).toBe(true);

    // Claim bonuses
    sues_round.claim_bonus(CaptureBonuses.BLACk_14);
    sues_round.claim_bonus(CaptureBonuses.YELLOW_14);

    // Test serialization and desrialization
    expect(validate_serialization_and_deserialization(game)).toBe(true);

    // Add alliances
    let alliance = new Alliance(mary, sue);
    marys_round.add_alliance(alliance);
    sues_round.add_alliance(alliance);

    // Test serialization and desrialization
    expect(validate_serialization_and_deserialization(game)).toBe(true);
});
