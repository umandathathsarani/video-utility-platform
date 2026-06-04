import { useState } from 'react';
import './Metadata.css';

export default function Metadata() {
  const [url, setUrl] = useState('');
  const [metadata, setMetadata] = useState(null);

  const handleExtract = (e) => {
    e.preventDefault();
    if (!url) return;
    
    setMetadata({
      channel: "Sample Channel Name",
      uploadedAt: "2024-05-12",
      views: "1,204,500",
      tags: ["technology", "coding", "education", "software engineering"]
    });
  };

  return (
    <div className="metadata-container">
      <h2>Metadata Extractor</h2>
      
      <form className="metadata-form" onSubmit={handleExtract}>
        <input
          type="text"
          placeholder="Paste URL to extract metadata..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit">Extract</button>
      </form>

      {metadata && (
        <div className="metadata-results">
          <div className="metadata-item">
            <span>Channel:</span> {metadata.channel}
          </div>
          <div className="metadata-item">
            <span>Uploaded:</span> {metadata.uploadedAt}
          </div>
          <div className="metadata-item">
            <span>Views:</span> {metadata.views}
          </div>
          <div className="metadata-tags">
            {metadata.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}