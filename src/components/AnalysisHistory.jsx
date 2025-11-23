'use client';

import { useState, useEffect } from 'react';
import { getHistory, clearHistory, getQualityTrend } from '../lib/historyTracker';
import '../styles/AnalysisHistory.css';

export default function AnalysisHistory() {
  const [history, setHistory] = useState([]);
  const [trend, setTrend] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getHistory();
    setHistory(data);
    setTrend(getQualityTrend());
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      clearHistory();
      loadHistory();
    }
  };

  if (history.length === 0) return null;

  return (
    <div className="analysis-history" role="region" aria-label="Analysis history">
      <div className="history-header">
        <h3>
          📊 Analysis History ({history.length})
        </h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="toggle-btn"
          aria-expanded={isExpanded}
          aria-controls="history-list"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {trend && (
        <div className="trend-indicator">
          <span>Average Score: <strong>{trend.averageScore.toFixed(0)}</strong></span>
          <span className={`trend ${trend.trend}`}>
            {trend.trend === 'improving' ? '📈 Improving' : '📉 Needs Attention'}
          </span>
        </div>
      )}

      {isExpanded && (
        <div id="history-list" className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item">
              <div className="item-header">
                <span className="file-name" title={item.fileName}>{item.fileName}</span>
                <span className={`score ${getScoreClass(item.qualityScore)}`}>
                  {item.qualityScore}
                </span>
              </div>
              <div className="item-details">
                <span>{item.summary.totalRows} rows</span>
                <span>{item.summary.completeness.toFixed(0)}% complete</span>
                <span className="timestamp">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
          <button onClick={handleClear} className="clear-btn" aria-label="Clear all history">
            Clear History
          </button>
        </div>
      )}
    </div>
  );
}

function getScoreClass(score) {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}
