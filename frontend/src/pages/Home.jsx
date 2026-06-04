import { useState } from 'react';
import { fetchVideoDetails } from '../services/api';
import './Home.css';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;
    setIsProcessing(true);
    
    try {
      const data = await fetchVideoDetails(url);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Video Downloader</h1>
        <p>Supports YouTube, Instagram, Facebook, TikTok, X, and more.</p>
      </div>
      
      <form className="download-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Paste video URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Fetch Video'}
        </button>
      </form>

      {result && (
        <div className="result-card">
          <img src={result.thumbnail} alt="Thumbnail" className="thumbnail" />
          <div className="result-info">
            <h3>{result.title}</h3>
            <p>Duration: {result.duration}</p>
            <div className="download-actions">
              <button className="btn-primary">Download MP4</button>
              <button className="btn-secondary">Download MP3</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}