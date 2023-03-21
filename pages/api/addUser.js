import users from '../../data/users.json'

export default function handler(req, res) {
  // Get the user in question
  const { name, gamesWon, gamesLost, rating } = req.body;
  users.push({
    name: name,
    gamesWon: gamesWon,
    gamesLost: gamesLost,
    rating: rating
  });
  const fs = require('fs');
  fs.writeFile('data/users.json', JSON.stringify(users), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }
    res.json({ success: true });
  });
}
