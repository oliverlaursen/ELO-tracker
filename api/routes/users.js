var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const fs = require('fs');
  fs.readFile('data/users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }
    const users = JSON.parse(data);
    res.json(users);
  });
});

module.exports = router;
