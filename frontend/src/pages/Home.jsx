import { useState } from 'react';
import { fetchVideoDetails } from '../services/api';
import './Home.css';

export default function Home() {
  const [urlsInput, setUrlsInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlArray = urlsInput.split('\n').map(u => u.trim()).filter(u => u);
    if (urlArray.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      const fetchPromises = urlArray.map(async (url) => {
        try {
          const data = await fetchVideoDetails(url);

          const defaultFormat = data.formats && data.formats.length > 0
            ? JSON.stringify({ id: data.formats[0].id, type: data.formats[0].type })
            : '';
            
          return { ...data, originalUrl: url, selectedFormat: defaultFormat, hasError: false };
        } catch (error) {
          console.error(`Failed to fetch ${url}`, error);
          return { originalUrl: url, hasError: true };
        }
      });

      const newResults = await Promise.all(fetchPromises);
      
      const successfulResults = newResults.filter(r => !r.hasError);
      setResults(prev => [...prev, ...successfulResults]);

      setUrlsInput('');
    } catch (error) {
      console.error(error);
      alert("A critical error occurred while fetching the videos.");
    } finally {
      setIsProcessing(false);
    }
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
        <p>Paste multiple URLs below (one per line) to fetch them all at once.</p>
      </div>
      
      <form className="download-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="https://youtube.com/...&#10;https://instagram.com/..."
          value={urlsInput}
          onChange={(e) => setUrlsInput(e.target.value)}
          rows="4"
          required
        />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing Batch...' : 'Fetch Videos'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="results-container">
          <div className="batch-actions">
            <h2>Ready to Download ({results.length})</h2>
            <div className="batch-buttons">
              <button className="btn-primary" onClick={handleDownloadAll}>
                Download All
              </button>
              <button className="btn-secondary" onClick={() => setResults([])}>
                Clear List
              </button>
            </div>
          </div>

          <div className="cards-grid">
            {results.map((video, index) => (
              <div className="result-card" key={index}>
                {video.thumbnail && <img src={video.thumbnail} alt="Thumbnail" className="thumbnail" />}
                
                <div className="result-info">
                  <h3 title={video.title}>
                    {video.title.length > 50 ? video.title.substring(0, 50) + "..." : video.title}
                  </h3>
                  <p>Duration: {video.duration}</p>
                  
                  {video.formats && video.formats.length > 0 ? (
                    <div className="format-selection">
                      <select 
                        className="quality-select"
                        value={video.selectedFormat} 
                        onChange={(e) => handleFormatChange(index, e.target.value)}
                      >
                        {video.formats.map((format) => (
                          <option key={format.id} value={JSON.stringify({ id: format.id, type: format.type })}>
                            {format.label} — {format.size}
                          </option>
                        ))}
                      </select>
                      <button className="btn-primary" onClick={() => handleSingleDownload(video)}>
                        Download File
                      </button>
                    </div>
                  ) : (
                     <p className="error-text">No direct download formats found.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}