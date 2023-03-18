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
    const {timestamp} = req.body;
    updatedMatches = matches.filter(match => match.timestamp !== timestamp)
    fs.writeFile('data/matches.json', JSON.stringify(updatedMatches), (err) => {
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
