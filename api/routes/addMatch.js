var express = require('express');
var router = express.Router();

/* POST add new user. */
router.post('/', function(req, res, next) {
  // Get the current user list
  const fs = require('fs');
  fs.readFile('data/matches.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }
    const matches = JSON.parse(data);

    // Get the user in question
    const {player1, player2, player1Goals, player2Goals} = req.body;
    console.log(req.body);
    matches.push({
      player1:player1,
      player2,player2,
      player1Goals:player1Goals,
      player2Goals:player2Goals,
      timestamp:Date.now()
    });
    fs.writeFile('data/matches.json', JSON.stringify(matches), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal server error');
        return;
      }
      res.json({ success: true });
    });
  });
});

module.exports = router;
