import React from 'react';
import { Activity } from 'lucide-react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <Activity size={32} />
          <div>
            <h1>⚽ Sportify AI</h1>
            <p>Global Football Intelligence & Club Matchmaking Engine</p>
          </div>
        </div>
      </div>
    </header>
  );
}
