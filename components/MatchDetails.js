import api from '../serverCalls'
import { useRouter } from 'next/router';

export default function MatchDetails({ match }) {
    let date = new Date(match.timestamp)
    let router = useRouter();
  
    const refreshData = () => {
      router.replace(router.asPath);
    }

    const handleDeleteClick = async (e) => {
      e.preventDefault();
      if (window.confirm("Are you sure you want to delete?")) {
        await api.removeMatch(match.timestamp);
        refreshData();
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
  