
const fs = require('fs');
const elo_calc = require('../../elo_calc');

export default async function handler(req, res) {
  try {
    // Get the current match list
    const matchesData = await fs.promises.readFile('data/matches.json', 'utf8');
    const matches = JSON.parse(matchesData);
    const usersData = await fs.promises.readFile('data/users.json', 'utf8');
    const users = JSON.parse(usersData);
    const { player1, player2, player1Goals, player2Goals } = req.body;

    // Get elo and elochange
    const [p1elo, p2elo] = elo_calc.getPlayerElos(player1, player2, users);
    const [p1elochange, p2elochange] = elo_calc.calcEloChange(p1elo, p2elo, parseInt(player1Goals), parseInt(player2Goals));

    // Add the new match
    matches.unshift({
      player1,
      player2,
      player1Elo:p1elo,
      player2Elo:p2elo,
      player1EloChange:p1elochange,
      player2EloChange:p2elochange,
      player1Goals: parseInt(player1Goals),
      player2Goals: parseInt(player2Goals),
      timestamp: Date.now()
    });
    await fs.promises.writeFile('data/matches.json', JSON.stringify(matches));

    // Update elos
    elo_calc.updatePlayersElo(player1, player2, p1elochange, p2elochange,users);

    // Update gameswon and gameslost
    if(player1Goals==10){
      elo_calc.incrementGamesWon(player1,users);
    } else {
      elo_calc.incrementGamesLost(player1,users);
    }
    if(player2Goals==10){
      elo_calc.incrementGamesWon(player2,users);
    } else {
      elo_calc.incrementGamesLost(player2,users);
    }

    elo_calc.writeToUsersFile(users);

    // Send response
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
}