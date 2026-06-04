import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h2>404</h2>
      <p>Page Not Found</p>
      <Link to="/" className="btn-home">Return to Home</Link>
    </div>
  );
}