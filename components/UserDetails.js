import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MatchDetails from './MatchDetails';

export default function UserDetails({ matches, users, name }) {
    const user = users.find(u => u.name === name);
    const games = matches.filter((game) => game.player1 === name || game.player2 === name)
    games.map(g => g.date = new Date(g.timestamp).getDate())
    games.map(g => {
      if (g.player1 === name) { g.elo = g.player1Elo }
      else if (g.player2 === name) { g.elo = g.player2Elo }
    })
    games.sort((a, b) => a.timestamp - b.timestamp)
  
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