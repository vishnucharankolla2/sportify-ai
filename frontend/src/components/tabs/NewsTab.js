import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NewsTab({ apiUrl }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNews();
  }, [apiUrl]);

  const loadNews = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${apiUrl}/news`, { 
        params: { limit: 10 },
        timeout: 10000 
      });
      setNews(response.data);
    } catch (err) {
      setError('Failed to load news: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-tab">
      <h2>📰 Latest News</h2>
      <button onClick={loadNews} disabled={loading}>
        {loading ? 'Loading...' : '📡 Load News'}
      </button>
      {error && <div className="error">{error}</div>}
      <div className="news-list">
        {news.map((article, idx) => (
          <div key={idx} className="news-card">
            <h3>{article.title}</h3>
            <p className="meta">{article.source} • {article.published_date}</p>
            <p>{article.summary}</p>
            <div className="confidence">
              Confidence: {(article.confidence_score * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
