import NavBar from '@/components/NavBar';
import api from '../serverCalls';
import MatchDetails from '@/components/MatchDetails';

export default function Matches({matches}) {
  return (
    <div>
      <NavBar />
      <h1 className='title has-text-centered'>Matches</h1>
      {matches.map(match => (
        <MatchDetails match={match} key={match.timestamp} />))}
    </div>
  );
}

export async function getServerSideProps(){
  const matches = await api.fetchMatches();
  return { props: { matches }}
}