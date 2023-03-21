import { useState } from "react";
import { useRouter } from "next/router";
import api from '../serverCalls'
import GoalSlider from "./GoalSlider";

export default function AddMatch({ users, setShowMatchForm }) {
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
  let router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    api.addMatch(match);
    setShowMatchForm(false);
    refreshData();
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

