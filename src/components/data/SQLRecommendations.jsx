'use client';

import { useState } from 'react';
import { generateSQLRecommendations } from '../../lib/sqlGenerator';
import '../../styles/SQLRecommendations.css';

export default function SQLRecommendations({ analysis }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const recommendations = generateSQLRecommendations(analysis);

  const copyToClipboard = async (sql, index) => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="sql-recommendations" role="region" aria-label="SQL recommendations">
      <div className="sql-header">
        <h2>🔧 SQL Cleanup Recommendations</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="toggle-btn"
          aria-expanded={isExpanded}
          aria-controls="sql-content"
        >
          {isExpanded ? 'Hide' : 'Show SQL'}
        </button>
      </div>

      <p className="sql-description">
        Ready-to-use SQL queries to clean and optimize your data
      </p>

      {isExpanded && (
        <div id="sql-content" className="sql-content">
          {recommendations.map((rec, recIdx) => (
            <div key={recIdx} className="sql-section">
              <div className="section-header">
                <h3>{rec.issue}</h3>
                <span className="issue-badge">{rec.description}</span>
              </div>

              {rec.queries.map((query, qIdx) => (
                <div key={qIdx} className="sql-query-card">
                  <div className="query-header">
                    <h4>{query.title}</h4>
                    <button
                      onClick={() => copyToClipboard(query.sql, `${recIdx}-${qIdx}`)}
                      className="copy-btn"
                      aria-label={`Copy ${query.title} SQL`}
                    >
                      {copiedIndex === `${recIdx}-${qIdx}` ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>

                  <pre className="sql-code">
                    <code>{query.sql}</code>
                  </pre>

                  <p className="query-explanation">
                    <strong>What this does:</strong> {query.explanation}
                  </p>
                </div>
              ))}
            </div>
          ))}

          <div className="sql-warning">
            <strong>⚠️ Important:</strong> Always test SQL queries on a backup or development database first!
            Some queries modify or delete data permanently.
          </div>
        </div>
      )}
    </div>
  );
}
