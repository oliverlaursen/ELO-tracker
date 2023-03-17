import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import users from './data/users.json';
import matches from './data/matches.json';


function Home(){
	return (
		<div>
			<button className='button'>Add match</button>
			<button className='button'>Add user</button>
		</div>
	);
}

function Matches(){
	return <h1>Matches</h1>
}

function Users(){
	return (
		<div>
			{users.map(user => (
				<Link to={`/users/${user.name}`} key={user.name}>
					<button className='button column'>{user.name}</button>
				</Link>
			))}
		</div>
	);
}

function MatchDetails({ player1, player2, player1Goals, player2Goals }) {
  return (
    <div className='box'>
      <p>{player1} VS {player2}</p>
      <p>Score: {player1Goals+" - "+player2Goals}</p>
    </div>
  );
}

function UserDetail() {
	const { name } = useParams(); // get the "name" parameter from the URL
  const user = users.find((u) => u.name.toLowerCase() === name.toLowerCase()); // find the corresponding user object

  if (!user) {
    return <p>User not found</p>;
  }
  return (
    <div>
      <h1 className='title'>{user.name}</h1>
			<h2 className='subtitle'>ELO: {user.rating} (
				<span className='has-text-success'>{user.gamesWon}</span> 
				/ 
				<span className='has-text-danger'>{user.gamesLost}</span>)
			</h2>

			<h2 className='subtitle'>Match history</h2>
      {matches.filter((game) => game.player1===name || game.player2===name).map(game => (
				<MatchDetails key={game.timestamp}
				player1={game.player1} player2={game.player2} player1Goals={game.player1Goals} player2Goals={game.player2Goals} />
      ))}
    </div>
  );
}

function App() {
	return (
		<BrowserRouter>
			<nav className="navbar is-primary" role="navigation" aria-label="main navigation">
				<div className="navbar-menu">
					<div className="navbar-start">
						<Link to="/"className="navbar-item">Home</Link>
						<Link to="/users" className="navbar-item">Users</Link>
						<Link to="/matches" className="navbar-item">Matches</Link>
					</div>
				</div>
			</nav>
			<Routes>
				<Route exact path="/" element={<Home />} />
      	<Route path="/users" element={<Users />} />
				<Route path="/users/:name" element={<UserDetail />} />
      	<Route path="/matches" element={<Matches />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
