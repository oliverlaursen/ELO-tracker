var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const fs = require('fs');
  fs.readFile('data/matches.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }
    const matches = JSON.parse(data);
    res.json(matches);
  });
});

module.exports = router;
