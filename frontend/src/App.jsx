import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'; 

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <h2>VideoUtil</h2>
        <div className="nav-links">
          <Link to="/">Downloader</Link>
        </div>
      </nav>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;