import Link from "next/link";
import { useState } from "react";


export default function NavBar() {
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = () => {
    setIsActive(!isActive);
  }
  return (
    <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
      <div className='navbar-brand'>
        <Link href="/" className="navbar-item">Home</Link>
        <a role="button" className={`navbar-burger ${isActive ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" data-target="navbarMenu" onClick={toggleMenu}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <Link href="/users" className="navbar-item">Users</Link>
          <Link href="/matches" className="navbar-item">Matches</Link>
        </div>
      </div>
    </nav>
  );
}