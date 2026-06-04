import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>VideoUtil</h2>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Downloader
          </Link>
        </li>
        <li>
          <Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>
            History
          </Link>
        </li>
        <li>
          <Link to="/metadata" className={location.pathname === '/metadata' ? 'active' : ''}>
            Metadata
          </Link>
        </li>
      </ul>
    </nav>
  );
}