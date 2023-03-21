import { Link } from 'next/link'
import { useState, useEffect } from 'react';
const {fetchUsers, recalcAllElos } = require('../serverCalls');
import NavBar from '@/components/NavBar';
import AddMatch from '@/components/AddMatch';
import AddUser from '@/components/AddUser';
import api from '../serverCalls'

export default function Home({users}) {
  const [showUserForm, setShowUserForm] = useState(false);
  const [showMatchForm, setShowMatchForm] = useState(false);

  const handleRecalc = async (e) => {
    e.preventDefault();
    await api.recalcAllElos();
  }

  return (
    <div>
      <NavBar />
      <button className='button' onClick={() => setShowMatchForm(!showMatchForm)}>Add match</button>
      {showMatchForm && <AddMatch setShowMatchForm={setShowMatchForm} users={users}/>}
      <button className='button' onClick={() => setShowUserForm(!showUserForm)}>Add user</button>
      {showUserForm && <AddUser />}
      <button className='button' onClick={handleRecalc}>Recalculate All Elos</button>
    </div>
  );
}

export async function getServerSideProps(){
  const users = await api.fetchUsers();
  return { props: { users }}
}