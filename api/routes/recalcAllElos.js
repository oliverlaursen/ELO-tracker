const express = require('express');
const router = express.Router();
const fs = require('fs');
const elo_calc = require('../elo_calc');

/* POST add new match. */
router.get('/', async function (req, res, next) {
    try {
        const START_ELO = 1400;
        const matchesData = await fs.promises.readFile('data/matches.json', 'utf8');
        const matches = JSON.parse(matchesData);
        const usersData = await fs.promises.readFile('data/users.json', 'utf8');
        const users = JSON.parse(usersData);

        users.map(u => u.rating = START_ELO);

        matches.sort((a, b) => a.timestamp - b.timestamp)
            .map(match => {
                const [p1elo, p2elo] = elo_calc.getPlayerElos(match.player1, match.player2, users);
                const [p1elochange, p2elochange] = elo_calc.calcEloChange(p1elo, p2elo, parseInt(match.player1Goals), parseInt(match.player2Goals));
                match.player1Elo = p1elo+p1elochange;
                match.player2Elo = p2elo+p2elochange;
                match.player1EloChange = p1elochange;
                match.player2EloChange = p2elochange;
                elo_calc.updatePlayersElo(match.player1,match.player2,p1elochange,p2elochange,users);
            });
        await fs.promises.writeFile('data/matches.json', JSON.stringify(matches));
        elo_calc.writeToUsersFile(users);
        // Send response
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
