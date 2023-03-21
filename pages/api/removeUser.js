import users from '../../data/users.json'

export default function handler(req, res) {
  // Get the user in question
  const { name } = req.body;
  const updatedUsers = users.filter(u => u.name !== name)
  const fs = require('fs');
  fs.writeFile('data/users.json', JSON.stringify(updatedUsers), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }
    res.json({ success: true });
  });
}
