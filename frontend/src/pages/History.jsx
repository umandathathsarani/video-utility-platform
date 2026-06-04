import './History.css';

export default function History() {
  const mockHistory = [
    { 
      id: 1, 
      url: "https://youtube.com/watch?v=java101", 
      title: "Java Object Oriented Programming Course", 
      date: "2026-06-03", 
      type: "Download" 
    },
    { 
      id: 2, 
      url: "https://youtube.com/watch?v=spring202", 
      title: "Spring Boot REST API Tutorial", 
      date: "2026-06-02", 
      type: "Metadata" 
    }
  ];

  return (
    <div className="history-container">
      <h2>Activity History</h2>
      <div className="history-list">
        {mockHistory.map(item => (
          <div key={item.id} className="history-card">
            <div className="history-info">
              <h4>{item.title}</h4>
              <p>{item.url}</p>
            </div>
            <div className="history-meta">
              <span className={`badge ${item.type.toLowerCase()}`}>{item.type}</span>
              <span className="date">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}