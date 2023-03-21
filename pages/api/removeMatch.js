import matches from '../../data/matches.json'

export default function handler(req, res) {
  // Get the user in question
  const { timestamp } = req.body;
  const fs = require('fs');
  const updatedMatches = matches.filter(match => match.timestamp !== timestamp)
  fs.writeFile('data/matches.json', JSON.stringify(updatedMatches), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }
    res.json({ success: true });
  });
}
