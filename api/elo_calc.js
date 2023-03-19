const fs = require('fs');
/**
 * Calculates 2 players elo change based on a match
 * Returns a tuple containing their elo changes as 
 * (p1elochange, p2elochange)
 * 
 * @param {Player 1's elo} p1elo 
 * @param {Player 2's elo} p2elo 
 * @param {How many goals player 1 scored (0-10)} p1goals 
 * @param {How many goals player 2 scored (0-10)} p2goals 
 */
function calcNewElo(p1elo, p2elo, p1goals, p2goals) {
    const k = 32; // Elo rating system constant
    const p1expected = 1 / (1 + Math.pow(10, (p2elo - p1elo) / 400)); // Expected score for player 1
    const p2expected = 1 / (1 + Math.pow(10, (p1elo - p2elo) / 400)); // Expected score for player 2
    const p1actual = p1goals / (p1goals + p2goals); // Actual score for player 1
    const p2actual = p2goals / (p1goals + p2goals); // Actual score for player 2
    const p1change = Math.round(k * (p1actual - p1expected)); // Change in elo for player 1
    const p2change = Math.round(k * (p2actual - p2expected)); // Change in elo for player 2
    return [p1change, p2change];
}

function getUsers() {
    return new Promise((resolve, reject) => {
      fs.readFile('./data/users.json', 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }
  
async function getPlayerElos(p1name,p2name){
    let users = await getUsers();
    let p1 = users.find(u => u.name == p1name);
    let p2 = users.find(u => u.name == p2name);
    return [p1.rating, p2.rating];
}

async function updatePlayersElo(p1name, p2name, p1elochange, p2elochange) {
    let users = await getUsers();
    let p1 = users.find(u => u.name == p1name);
    let p2 = users.find(u => u.name == p2name);
    p1.rating += p1elochange;
    p2.rating += p2elochange;
    fs.writeFile('data/users.json', JSON.stringify(users), (err) => {
        if (err) {
          console.error(err);
          return;
        }
    })
}

module.exports.getPlayerElos = getPlayerElos;
module.exports.calcNewElo = calcNewElo;
module.exports.updatePlayersElo = updatePlayersElo;
