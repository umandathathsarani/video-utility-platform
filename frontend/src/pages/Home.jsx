import { useState } from 'react';
import { fetchVideoDetails, fetchPlaylistUrls } from '../services/api';
import './Home.css';
import Toast from '../components/Toast';

export default function Home() {
  const [toast, setToast] = useState(null);
  const [urlsInput, setUrlsInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtractingPlaylist, setIsExtractingPlaylist] = useState(false);
  const [results, setResults] = useState([]);

  const handlePlaylistExtract = async () => {
    const playlistUrl = urlsInput.split('\n')[0].trim();
    if (!playlistUrl) {
      alert("Please paste a valid playlist URL into the box first.");
      return;
    }

    setIsExtractingPlaylist(true);
  try {
    const data = await fetchPlaylistUrls(playlistUrl);
    setUrlsInput(data.urls.join('\n'));
    setToast(`Successfully extracted ${data.urls.length} videos`);
  } catch (error) {
    setToast("Failed to extract playlist. Check if it's public.");
  } finally {
      setIsExtractingPlaylist(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlArray = urlsInput.split('\n').map(u => u.trim()).filter(u => u);
    if (urlArray.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const fetchPromises = urlArray.map(async (url) => {
        const response = await fetch('http://localhost:5000/api/video/basic-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        const data = await response.json();
        return { ...data, originalUrl: url, formats: [], selectedFormat: '' };
      });

      const newResults = await Promise.all(fetchPromises);
      setResults(prev => [...prev, ...newResults]);
      setUrlsInput('');
    } catch (error) {
      alert("A critical error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const loadFormats = async (index) => {
    if (results[index].formats.length > 0) return;

    const data = await fetchVideoDetails(results[index].originalUrl);
    const updated = [...results];
    updated[index].formats = data.formats;
    updated[index].selectedFormat = data.formats.length > 0 ? JSON.stringify({ id: data.formats[0].id, type: data.formats[0].type }) : '';
    setResults(updated);
  };

  const handleFormatChange = (index, newFormat) => {
    const updatedResults = [...results];
    updatedResults[index].selectedFormat = newFormat;
    setResults(updatedResults);
  };

  const handleSingleDownload = (video) => {
    if (!video.selectedFormat) return;
    const formatData = JSON.parse(video.selectedFormat);
    const downloadUrl = `http://localhost:5000/api/video/download?url=${encodeURIComponent(video.originalUrl)}&type=${formatData.type}&formatId=${formatData.id}`;
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    results.forEach((video, index) => {
      setTimeout(() => {
        handleSingleDownload(video);
      }, index * 800);
    });
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Batch Video Downloader</h1>
        <p>Paste multiple URLs below, or paste a Playlist URL and extract it.</p>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
      
      <form className="download-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="https://youtube.com/playlist?list=...&#10;or paste multiple individual links here..."
          value={urlsInput}
          onChange={(e) => setUrlsInput(e.target.value)}
          rows="5"
          required
        />
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" style={{ flex: 2 }} disabled={isProcessing || isExtractingPlaylist}>
            {isProcessing ? 'Processing Batch...' : 'Fetch Videos'}
          </button>
          
          <button type="button" className="btn-secondary" style={{ flex: 1, padding: '1rem', border: '1px solid #4f46e5', color: '#818cf8' }} onClick={handlePlaylistExtract} disabled={isProcessing || isExtractingPlaylist || !urlsInput}>
            {isExtractingPlaylist ? 'Extracting...' : 'Extract Playlist'}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="results-container">
          <div className="batch-actions">
            <h2>Ready to Download ({results.length})</h2>
            <div className="batch-buttons">
              <button className="btn-primary" onClick={handleDownloadAll}>Download All</button>
              <button className="btn-secondary" onClick={() => setResults([])}>Clear List</button>
            </div>
          </div>

          <div className="cards-grid">
            {results.map((video, index) => (
              <div className="result-card" key={index}>
                {video.thumbnail && <img src={video.thumbnail} alt="Thumbnail" className="thumbnail" />}
                
                <div className="result-info">
                  <h3 title={video.title}>{video.title.length > 50 ? video.title.substring(0, 50) + "..." : video.title}</h3>
                  <p>Duration: {video.duration}</p>
                  
                  <div className="format-selection">
                    <select 
                      className="quality-select"
                      value={video.selectedFormat} 
                      onClick={() => loadFormats(index)}
                      onChange={(e) => handleFormatChange(index, e.target.value)}
                    >
                      {video.formats.length === 0 ? (
                        <option>Click to load qualities...</option>
                      ) : (
                        video.formats.map((format) => (
                          <option key={format.id} value={JSON.stringify({ id: format.id, type: format.type })}>
                            {format.label} — {format.size}
                          </option>
                        ))
                      )}
                    </select>
                    <button className="btn-primary" onClick={() => handleSingleDownload(video)}>
                      Download File
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}