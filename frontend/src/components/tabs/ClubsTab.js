import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ClubsTab({ apiUrl }) {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClubs();
  }, [apiUrl]);

  const loadClubs = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${apiUrl}/clubs`, { timeout: 10000 });
      setClubs(response.data);
    } catch (err) {
      setError('Failed to load clubs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clubs-tab">
      <h2>🏟️ Club Profiles</h2>
      <button onClick={loadClubs} disabled={loading}>
        {loading ? 'Loading...' : '📂 Load Clubs'}
      </button>
      {error && <div className="error">{error}</div>}
      <div className="clubs-grid">
        {clubs.map(club => (
          <div key={club.id} className="club-card">
            <h3>{club.name}</h3>
            <p><strong>Country:</strong> {club.country}</p>
            <p><strong>League:</strong> {club.league}</p>
            <p><strong>Founded:</strong> {club.founded_year}</p>
            <p><strong>Stadium:</strong> {club.stadium}</p>
            <p><strong>Budget:</strong> ${club.budget}M</p>
          </div>
        ))}
      </div>
    </div>
  );
}
