import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';


function GoalSlider(props) {

	const handleChange = (event) => {
		props.setValue(event.target.value);
	};

	return (
		<div className="slider-container">
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

	const handleSubmit = (e) => {
		e.preventDefault();
		fetch("http://localhost:9000/addUser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: name,
				gamesWon: 0,
				gamesLost: 0,
				rating: rating
			}),
		})
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((error) => console.error(error));

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
function AddMatch({ addMatch, setShowMatchForm, users }) {
	const [player1, setPlayer1] = useState('');
	const [player2, setPlayer2] = useState('');
	const [player1Goals, setPlayer1Goals] = useState(0);
	const [player2Goals, setPlayer2Goals] = useState(0);

	const handleSubmit = (e) => {
		e.preventDefault();
		addMatch({ player1, player2, player1Goals, player2Goals });
		setShowMatchForm(false);
	};

	return (
		<form onSubmit={handleSubmit} className="box">
			<div className='field'>
				<label className='label'>Player 1</label>
				<div className='control'>
					<div className='select'>
						<select value={player1} onChange={(e) => setPlayer1(e.target.value)} required>
							<option value=''>Select player</option>
							{users.map((player) => (
								<option key={player.name} value={player.name}>
									{player.name}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
			<div className='field'>
				<label className='label'>Player 2</label>
				<div className='control'>
					<div className='select'>
						<select value={player2} onChange={(e) => setPlayer2(e.target.value)} required	>
							<option value=''>Select player</option>
							{users.map((player) => (
								<option key={player.name} value={player.name}>
									{player.name}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
			<div className='field'>
				<label className='label'>Player 1 goals</label>
				<GoalSlider value={player1Goals} setValue={setPlayer1Goals} />
			</div>
			<div className='field'>
				<label className='label'>Player 2 goals</label>
				<GoalSlider value={player2Goals} setValue={setPlayer2Goals} />
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

function Home({ addMatch, users }) {
	const [showUserForm, setShowUserForm] = useState(false);
	const [showMatchForm, setShowMatchForm] = useState(false);

	return (
		<div>
			<button className='button' onClick={() => setShowMatchForm(!showMatchForm)}>Add match</button>
			{showMatchForm && <AddMatch addMatch={addMatch} setShowMatchForm={setShowMatchForm} users={users} />}
			<button className='button' onClick={() => setShowUserForm(!showUserForm)}>Add user</button>
			{showUserForm && <AddUser />}
		</div>
	);
}

function Matches({ matches, deleteMatch }) {
	return (
		<div>
			<h1 className='title has-text-centered'>Matches</h1>
			{matches.map(match => (
				<MatchDetails match={match} key={match.timestamp} deleteMatch={deleteMatch} />))}
		</div>
	);
}

function Users({ users }) {
	return (
		<div>
			<h1 className='title has-text-centered'>Users</h1>
			<div className='columns'>
				{users.map(user => (
					<Link to={`/users/${user.name}`} key={user.name} className='column button'> {user.name}
					</Link>
				))}
			</div>
		</div>
	);
}


function MatchDetails({ match, deleteMatch }) {
	let date = new Date(match.timestamp)
	const handleDeleteClick = () => {
		deleteMatch(match.timestamp);
	};

	return (
		<div className='box'>
			<div className='level'>
				<div className='level-left'>
					<div>
						<p>{match.player1} VS {match.player2}</p>
						<p>Score: {match.player1Goals + " - " + match.player2Goals}</p>
						<p>{date.getHours() + ":" + date.getMinutes() + ", " + date.toDateString()}</p>
					</div>
				</div>
				<div className='level-right'>
					<button className='button is-danger' onClick={handleDeleteClick} data-value={match.timestamp}>Delete</button>
				</div>
			</div>
		</div>
	);
}

function UserDetail({ matches, users }) {
	const { name } = useParams(); // get the "name" parameter from the URL
	const user = users.find(u => u.name === name);

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
			{matches.filter((game) => game.player1 === name || game.player2 === name).map(game => (
				<MatchDetails key={game.timestamp} match={game} />
			))}
		</div>
	);
}

function App() {
	const [users, setUsers] = useState([])
	const [isActive, setIsActive] = useState(false);
	const [matches, setMatches] = useState(JSON.parse(localStorage.getItem('matches')) || []);

	useEffect(() => {
		const FetchUsers = async () => {
			await fetch("http://localhost:9000/users")
				.then((res) => res.json())
				.then((data) => setUsers(data))
		}; FetchUsers();
	}, []);



	const toggleMenu = () => {
		setIsActive(!isActive);
	}

	function deleteMatch(timestamp) {
		const updatedMatches = matches.filter(match => match.timestamp !== timestamp);
		setMatches(updatedMatches);
		localStorage.setItem('matches', JSON.stringify(updatedMatches));
	}

	function addMatch(match) {
		const updatedMatches = [...matches, {
			player1: match.player1,
			player2: match.player2,
			player1Goals: match.player1Goals,
			player2Goals: match.player2Goals,
			timestamp: Date.now()
		}];
		setMatches(updatedMatches);
		localStorage.setItem('matches', JSON.stringify(updatedMatches));
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
				<Route exact path="/" element={<Home addMatch={addMatch} users={users} />} />
				<Route path="/users" element={<Users users={users} />} />
				<Route path="/users/:name" element={<UserDetail matches={matches} users={users} />} />
				<Route path="/matches" element={<Matches matches={matches} deleteMatch={deleteMatch} />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
