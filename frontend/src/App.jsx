import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import History from './pages/History';
import Metadata from './pages/Metadata';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/metadata" element={<Metadata />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}