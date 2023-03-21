import NavBar from "@/components/NavBar.js";
import React, { useEffect, useState } from "react";
import api from '../../serverCalls.js'
import Link from "next/link.js";
import { useRouter } from "next/router.js";



export default function Users({users}) {
  let router = useRouter()
  const handleRemoveUser = async (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete?")) {
      let user = e.target.dataset.value;
      await api.removeUser(user); 
      refreshData();
    }
  }
  
  const refreshData = () => {
    router.replace(router.asPath);
  }

  return (
    <div>
      <NavBar />
      <h1 className='title has-text-centered'>Users</h1>
      <ul className='is-multiline'>
        {users.sort((a, b) => b.rating - a.rating).map(user => (
          <li key={user.name} className='box'>
            <div className='columns is-mobile is-vcentered'>
              <div className='column'>
                <Link href={`/users/${user.name}`} key={user.name} className='has-text-left'> {user.name}
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

export async function getServerSideProps(){
  const users = await api.fetchUsers();
  return { props: { users }}
}