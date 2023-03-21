async function getIPAddress() {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  return data.ip;
}

//const PUBLIC_IP = await getIPAddress()
const PUBLIC_IP = "localhost"
const PORT = 3000;

async function fetchUsers() {
  const res = await fetch(`http://${PUBLIC_IP}:${PORT}/api/users`);
  const data = await res.json();
  return data;
}


async function removeUser(name){
  await fetch(`http://${PUBLIC_IP}:${PORT}/api/removeUser`, {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({ name })
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

async function addUser(user) {
  await fetch(`http://${PUBLIC_IP}:${PORT}/api/addUser`, {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify(user)
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

async function fetchMatches() {
  const res = await fetch(`http://${PUBLIC_IP}:${PORT}/api/matches`);
  const data = await res.json();
  return data;
}

async function addMatch(match) {
  await fetch(`http://${PUBLIC_IP}:${PORT}/api/addMatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify(match)
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

async function removeMatch(timestamp) {
  await fetch(`http://${PUBLIC_IP}:${PORT}/api/removeMatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({ timestamp })
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

async function recalcAllElos() {
  await fetch(`http://${PUBLIC_IP}:${PORT}/api/recalcAllElos`)
    .then((res) => res.json(), {
      method: "POST",
      headers: { "Content-Type": "application/json", }
    })
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

export default {
  fetchUsers,
  removeUser,
  addUser,
  fetchMatches,
  removeMatch,
  addMatch,
  recalcAllElos
}
