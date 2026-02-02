import React, { useState } from 'react';
import axios from 'axios';
import './PlayersTab.css';

export default function PlayersTab({ apiUrl }) {
  const [searchName, setSearchName] = useState('');
  const [position, setPosition] = useState('All');
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setPlayers([]);

    try {
      const params = {
        limit: 20,
        min_age: ageRange[0],
        max_age: ageRange[1]
      };

      if (searchName) params.search = searchName;
      if (position !== 'All') params.position = position;

      const response = await axios.get(`${apiUrl}/players`, { params, timeout: 10000 });
      setPlayers(response.data);
    } catch (err) {
      setError('Failed to search players: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="players-tab">
      <h2>👥 Player Search</h2>
      <p className="subtitle">Search and filter from 1000+ players</p>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Search by player name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="search-input"
        />
        <select value={position} onChange={(e) => setPosition(e.target.value)} className="filter-select">
          <option>All</option>
          <option>Forward</option>
          <option>Midfielder</option>
          <option>Defender</option>
          <option>Goalkeeper</option>
        </select>
        <div className="age-range">
          <label>Age: {ageRange[0]} - {ageRange[1]}</label>
          <input type="range" min="18" max="40" value={ageRange[0]} onChange={(e) => setAgeRange([parseInt(e.target.value), ageRange[1]])} />
          <input type="range" min="18" max="40" value={ageRange[1]} onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])} />
        </div>
        <button onClick={handleSearch} disabled={loading} className="search-btn">
          {loading ? 'Searching...' : '🔍 Search'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {players.length > 0 ? (
        <table className="players-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Club</th>
              <th>Age</th>
              <th>Rating</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{player.position}</td>
                <td>{player.club}</td>
                <td>{player.age}</td>
                <td>{player.rating || 'N/A'}</td>
                <td>{player.is_available ? '✅ Available' : '❌ Unavailable'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty">Click search or enter criteria to find players</p>
      )}
    </div>
  );
}
