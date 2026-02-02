export default function DocsTab() {
  return (
    <div className="docs-tab">
      <h2>📚 Documentation</h2>
      
      <section>
        <h3>Quick Start</h3>
        <ol>
          <li>Configure your API URL in the top bar</li>
          <li>Click "Test Connection" to verify connectivity</li>
          <li>Use the tabs above to explore different features</li>
        </ol>
      </section>

      <section>
        <h3>API Configuration</h3>
        <p><strong>Local Testing:</strong> <code>http://YOUR_IP:3000/api</code></p>
        <p><strong>Production:</strong> <code>https://your-api-domain.com/api</code></p>
      </section>

      <section>
        <h3>Features</h3>
        <ul>
          <li><strong>🎯 Recommendations:</strong> AI-powered player matching with multi-factor scoring</li>
          <li><strong>👥 Players:</strong> Search database, filter by position/age/club</li>
          <li><strong>🏟️ Clubs:</strong> View club profiles and requirements</li>
          <li><strong>📰 News:</strong> Real-time football news with confidence scoring</li>
        </ul>
      </section>

      <section>
        <h3>Recommendation Algorithm</h3>
        <table>
          <thead>
            <tr>
              <th>Factor</th>
              <th>Weight</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fit Score</td>
              <td>35%</td>
              <td>Player profile match with club needs</td>
            </tr>
            <tr>
              <td>Performance</td>
              <td>25%</td>
              <td>Current rating and statistics</td>
            </tr>
            <tr>
              <td>Availability</td>
              <td>20%</td>
              <td>Transfer status and window</td>
            </tr>
            <tr>
              <td>News Impact</td>
              <td>15%</td>
              <td>Recent news and events</td>
            </tr>
            <tr>
              <td>Risk Factor</td>
              <td>-5%</td>
              <td>Stability concerns</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h3>Resources</h3>
        <ul>
          <li><a href="https://github.com/vishnucharankolla2/sportify-ai" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
          <li><a href="https://github.com/vishnucharankolla2/sportify-ai/tree/main/backend/docs" target="_blank" rel="noopener noreferrer">API Documentation</a></li>
          <li><a href="https://github.com/vishnucharankolla2/sportify-ai/blob/main/backend/docs/DATABASE.md" target="_blank" rel="noopener noreferrer">Database Schema</a></li>
        </ul>
      </section>
    </div>
  );
}
