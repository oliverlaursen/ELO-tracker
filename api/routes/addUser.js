var express = require('express');
var router = express.Router();

/* POST add new user. */
router.post('/', function(req, res, next) {
  // Get the current user list
  const fs = require('fs');
  fs.readFile('data/users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }
    const users = JSON.parse(data);

    // Get the user in question
    const {name, gamesWon, gamesLost, rating} = req.body;
    console.log(req.body);
    users.push({
      name: name,
      gamesWon:gamesWon,
      gamesLost:gamesLost,
      rating:rating
    });
    fs.writeFile('data/users.json', JSON.stringify(users), (err) => {
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
