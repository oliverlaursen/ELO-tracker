const express = require('express');
const router = express.Router();
const fs = require('fs');
const elo_calc = require('../elo_calc');

/* POST add new match. */
router.post('/', async function (req, res, next) {
  try {
    // Get the current match list
    const data = await fs.promises.readFile('data/matches.json', 'utf8');
    const matches = JSON.parse(data);
    const { player1, player2, player1Goals, player2Goals } = req.body;

    // Get elo and elochange
    const [p1elo, p2elo] = await elo_calc.getPlayerElos(player1, player2);
    const [p1elochange, p2elochange] = elo_calc.calcNewElo(p1elo, p2elo, parseInt(player1Goals), parseInt(player2Goals));

    // Add the new match
    matches.push({
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
    await elo_calc.updatePlayersElo(player1, player2, p1elochange, p2elochange);

    // Send response
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
