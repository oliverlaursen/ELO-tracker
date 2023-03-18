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
    const {name} = req.body;
    console.log(req.body);
    updatedUsers = users.filter(u => u.name !== name)
    fs.writeFile('data/users.json', JSON.stringify(updatedUsers), (err) => {
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
