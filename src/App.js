import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


async function getIPAddress() {
	const response = await fetch('https://api.ipify.org?format=json');
	const data = await response.json();
	return data.ip;
}

const PUBLIC_IP = await getIPAddress()
//const PUBLIC_IP = "localhost"

function GoalSlider(props) {
	const handleChange = (event) => {
		props.setValue(event.target.value);
	};

	return (
		<div className="slider-container level-item">
			<input
				type="range"
				min="0"
				max="10"
				value={props.value}
				onChange={handleChange}
				className="slider"
			/>
			<output className="slider-value">{props.value}</output>
		</div>
	);
}

function AddUser() {
	const [name, setName] = useState("");
	const [rating, setRating] = useState("");
	const user = {
		name: name,
		gamesWon: 0,
		gamesLost: 0,
		rating: parseInt(rating)
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		addUser(user)
		setRating("");
		setName("");
	}

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const handleRatingChange = (event) => {
		setRating(event.target.value);
	};
	return (
		<form className="box">
			<div className="field">
				<label className="label">Name</label>
				<input className="input" value={name} onChange={handleNameChange}></input>
				<label className="label">Rating</label>
				<input className="input" type="number" value={rating} onChange={handleRatingChange}></input>
				<input type="submit" value="Add user" className='button is-primary' onClick={handleSubmit} />
			</div>
		</form>
	);
}

function AddMatch({ setShowMatchForm, users }) {
	const [player1, setPlayer1] = useState('');
	const [player2, setPlayer2] = useState('');
	const [player1Goals, setPlayer1Goals] = useState(0);
	const [player2Goals, setPlayer2Goals] = useState(0);
	const match = {
		player1: player1,
		player2: player2,
		player1Goals: player1Goals,
		player2Goals: player2Goals
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		addMatch(match);
		setShowMatchForm(false);
	};

	return (
		<form onSubmit={handleSubmit} className="box">
			<div className='field'>
				<label className='label'>Player 1</label>
				<div className='select'>
					<select value={player1} onChange={(e) => setPlayer1(e.target.value)} required>
						<option value=''>Select player</option>
						{users.map((player) => (
							<option key={player.name} value={player.name}>
								{player.name}
							</option>))}
					</select>
				</div>
			</div>
			<div className='field'>
				<label className='label'>Player 2</label>
				<div className='select'>
					<select value={player2} onChange={(e) => setPlayer2(e.target.value)} required>
						<option value=''>Select player</option>
						{users.map((player) => (
							<option key={player.name} value={player.name}>
								{player.name}
							</option>))}
					</select>
				</div>
			</div>
			<div className='level'>
				<div className='field level-left'>
					<div>
						<label className='label level-item'>Player 1 goals</label>
						<GoalSlider value={player1Goals} setValue={setPlayer1Goals} />
					</div>
				</div>
			</div>
			<div className='level'>
				<div className='field level-left'>
					<div>
						<label className='label level-item'>Player 2 goals</label>
						<GoalSlider value={player2Goals} setValue={setPlayer2Goals} />
					</div>
				</div>
			</div>
			<div className='field'>
				<div className='control'>
					<button type='submit' className='button is-primary' onClick={handleSubmit}>
						Add match
					</button>
				</div>
			</div>
		</form>
	);
}

function Home({ users }) {
	const [showUserForm, setShowUserForm] = useState(false);
	const [showMatchForm, setShowMatchForm] = useState(false);

	const handleRecalc = (e) => {
		e.preventDefault();
		recalcAllElos();
	}

	return (
		<div>
			<button className='button' onClick={() => setShowMatchForm(!showMatchForm)}>Add match</button>
			{showMatchForm && <AddMatch setShowMatchForm={setShowMatchForm} users={users} />}
			<button className='button' onClick={() => setShowUserForm(!showUserForm)}>Add user</button>
			{showUserForm && <AddUser />}
			<button className='button' onClick={handleRecalc}>Recalculate All Elos</button>
		</div>
	);
}

function Matches({ matches, setMatches }) {
	useEffect(() => {
		fetchMatches(setMatches);
	}, []);
	return (
		<div>
			<h1 className='title has-text-centered'>Matches</h1>
			{matches.map(match => (
				<MatchDetails match={match} key={match.timestamp} setMatches={setMatches} />))}
		</div>
	);
}

function Users({ users, setUsers }) {
	useEffect(() => {
		fetchUsers(setUsers);
	}, []);

	const handleRemoveUser = async (e) => {
		e.preventDefault();
		if (window.confirm("Are you sure you want to delete?")) {
			let user = e.target.dataset.value;
			await removeUser(user);
			await fetchUsers(setUsers);
		}
	}

	return (
		<div>
			<h1 className='title has-text-centered'>Users</h1>
			<ul className='is-multiline'>
				{users.sort((a, b) => b.rating - a.rating).map(user => (
					<li key={user.name} className='box'>
						<div className='columns is-mobile is-vcentered'>
							<div className='column'>
								<Link to={`/users/${user.name}`} key={user.name} className='has-text-left'> {user.name}
								</Link>
							</div>
							<div className='column'>
								<p className='has-text-centered'>ELO:{user.rating}</p>

							</div>
							<div className='column'>
								<button className='button is-danger is-pulled-right' data-value={user.name} onClick={handleRemoveUser}>Delete</button>
							</div>
						</div>
					</li>

				))}
			</ul>
		</div>
	);
}

function MatchDetails({ match, setMatches }) {
	let date = new Date(match.timestamp)

	const handleDeleteClick = async (e) => {
		e.preventDefault();
		if (window.confirm("Are you sure you want to delete?")) {
			await removeMatch(match.timestamp);
			await fetchMatches(setMatches)
		}
	};

	return (
		<div className='box'>
			<div className='columns is-mobile is-vcentered'>
				<div className='column'>
					<div>
						<div className='level-item level-left'>
							<p>{match.player1} ({match.player1Elo})</p>
							<span className={`${match.player1EloChange >= 0 ? 'has-text-success' : 'has-text-danger'}`}>
								{match.player1EloChange >= 0 ? '+' : ''}{match.player1EloChange}
							</span>
						</div>
						<div className='level-item level-left'>
							<p>{match.player2} ({match.player2Elo})</p>
							<span className={`${match.player2EloChange >= 0 ? 'has-text-success' : 'has-text-danger'}`}>
								{match.player2EloChange >= 0 ? '+' : ''}{match.player2EloChange}
							</span>
						</div>
						<p>Score: {match.player1Goals + " - " + match.player2Goals}</p>
						<p>{date.getHours() + ":" + date.getMinutes() + ", " + date.toDateString()}</p>
					</div>
				</div>
				<div className='column'>
					<button className='button is-danger is-pulled-right' onClick={handleDeleteClick}>Delete</button>
				</div>
			</div>
		</div>
	);
}

function UserDetail({ matches, users }) {
	const { name } = useParams(); // get the "name" parameter from the URL
	const user = users.find(u => u.name === name);
	const games = matches.filter((game) => game.player1 === name || game.player2 === name)
	games.map(g => g.date = new Date(g.timestamp).getDate())
	games.map(g => {
		if(g.player1 === name){g.elo = g.player1Elo}
		else if(g.player2 === name){g.elo = g.player2Elo}
	})
	games.sort((a,b) => a.timestamp - b.timestamp)

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

			<LineChart width={500} height={300} data={games}>
				<XAxis dataKey="date" />
				<YAxis />
				<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
				<Line type="monotone" dataKey="elo" stroke="#8884d8" />
			</LineChart>


			<h2 className='subtitle'>Match history</h2>
			{games.map(game => (
				<MatchDetails key={game.timestamp} match={game} />
			))}
		</div>
	);
}

const fetchUsers = async (setUsers) => {
	await fetch("http://" + PUBLIC_IP + ":9000/api/users")
		.then((res) => res.json())
		.then((data) => setUsers(data))
}

const removeUser = async (name) => {
	await fetch("http://" + PUBLIC_IP + ":9000/api/removeUser", {
		method: "POST",
		headers: { "Content-Type": "application/json", },
		body: JSON.stringify({ name })
	})
		.then((response) => response.json())
		.catch((error) => console.error(error));
}

const addUser = async (user) => {
	await fetch("http://" + PUBLIC_IP + ":9000/api/addUser", {
		method: "POST",
		headers: { "Content-Type": "application/json", },
		body: JSON.stringify(user)
	})
		.then((response) => response.json())
		.catch((error) => console.error(error));
}

const fetchMatches = async (setMatches) => {
	await fetch("http://" + PUBLIC_IP + ":9000/api/matches")
		.then((res) => res.json())
		.then((data) => setMatches(data))
}

const addMatch = async (match) => {
	await fetch("http://" + PUBLIC_IP + ":9000/api/addMatch", {
		method: "POST",
		headers: { "Content-Type": "application/json", },
		body: JSON.stringify(match)
	})
		.then((response) => response.json())
		.catch((error) => console.error(error));
}

const removeMatch = async (timestamp) => {
	await fetch("http://" + PUBLIC_IP + ":9000/api/removeMatch", {
		method: "POST",
		headers: { "Content-Type": "application/json", },
		body: JSON.stringify({ timestamp })
	})
		.then((response) => response.json())
		.catch((error) => console.error(error));
}

const recalcAllElos = async () => {
	await fetch("http://" + PUBLIC_IP + ":9000/api/recalcAllElos")
	.then((res) => res.json(), {
		method:"POST",
		headers: {"Content-Type":"application/json",}
	})
		.then((response) => response.json())
		.catch((error) => console.error(error));
}

function App() {
	const [users, setUsers] = useState([])
	const [isActive, setIsActive] = useState(false);
	const [matches, setMatches] = useState([]);


	useEffect(() => {
		fetchUsers(setUsers);
	}, []);
	useEffect(() => {
		fetchMatches(setMatches);
	}, []);

	const toggleMenu = () => {
		setIsActive(!isActive);
	}

	return (
		<BrowserRouter>
			<nav className="navbar is-primary" role="navigation" aria-label="main navigation">
				<div className='navbar-brand'>
					<Link to="/" className="navbar-item">Home</Link>
					<a role="button" className={`navbar-burger ${isActive ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" data-target="navbarMenu" onClick={toggleMenu}>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</div>
				<div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
					<div className="navbar-start">
						<Link to="/users" className="navbar-item">Users</Link>
						<Link to="/matches" className="navbar-item">Matches</Link>
					</div>
				</div>
			</nav>
			<Routes>
				<Route exact path="/" element={<Home users={users} />} />
				<Route path="/users" element={<Users users={users} setUsers={setUsers} />} />
				<Route path="/users/:name" element={<UserDetail matches={matches} users={users} />} />
				<Route path="/matches" element={<Matches matches={matches} setMatches={setMatches} />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
