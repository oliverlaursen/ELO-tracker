const fs = require('fs');
/**
 * Calculates 2 players elo change based on a match
 * Returns a tuple containing their elo changes as 
 * (p1elochange, p2elochange)
 * 
 * @param {Player 1's elo} p1elo 
 * @param {Player 2's elo} p2elo 
 * @param {How many goals player 1 scored (0 to 10)} p1goals 
 * @param {How many goals player 2 scored (0 to 10)} p2goals 
 */
function calcEloChange(p1elo, p2elo, p1goals, p2goals) {
    const kFactor = 128; // K-factor determines how much Elo rating changes after a match

    const expectedScoreP1 = 1 / (1 + 10 ** ((p2elo - p1elo) / 400)); // Expected score of player 1
    const expectedScoreP2 = 1 - expectedScoreP1; // Expected score of player 2

    const actualScoreP1 = p1goals / (p1goals + p2goals); // Actual score of player 1
    const actualScoreP2 = p2goals / (p1goals + p2goals); // Actual score of player 2

    const p1eloChange = Math.round(kFactor * (actualScoreP1 - expectedScoreP1)); // Elo change for player 1
    const p2eloChange = Math.round(kFactor * (actualScoreP2 - expectedScoreP2)); // Elo change for player 2

    return [p1eloChange, p2eloChange]; // Return tuple containing the elo changes (with opposite sign for player 2)
}


function getPlayerElos(p1name, p2name, users) {
    let p1 = users.find(u => u.name == p1name);
    let p2 = users.find(u => u.name == p2name);
    return [p1.rating, p2.rating];
}

function updatePlayersElo(p1name, p2name, p1elochange, p2elochange, users) {
    let p1 = users.find(u => u.name == p1name);
    let p2 = users.find(u => u.name == p2name);
    p1.rating += p1elochange;
    p2.rating += p2elochange;
}

function writeToUsersFile(users) {
    fs.writeFile('data/users.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error(err);
            return;
        }
    })
}

function incrementGamesWon(playerName, users) {
    let player = users.find(u => u.name === playerName);
    player.gamesWon += 1;
}

function incrementGamesLost(playerName, users) {
    let player = users.find(u => u.name === playerName);
    player.gamesLost += 1;
}

module.exports.getPlayerElos = getPlayerElos;
module.exports.calcEloChange = calcEloChange;
module.exports.updatePlayersElo = updatePlayersElo;
module.exports.incrementGamesLost = incrementGamesLost;
module.exports.incrementGamesWon = incrementGamesWon;
module.exports.writeToUsersFile = writeToUsersFile;
