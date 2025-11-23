'use client';

import { useState } from 'react';
import '../../styles/IssuesPanel.css';

export default function IssuesPanel({ anomalies = [], schemaIssues = [] }) {
  const [activeTab, setActiveTab] = useState('all');

  const allIssues = [
    ...anomalies.map(a => ({ ...a, category: 'anomaly' })),
    ...schemaIssues.map(s => ({ ...s, category: 'schema' })),
  ].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const filteredIssues = activeTab === 'all' 
    ? allIssues 
    : allIssues.filter(i => i.category === activeTab);

  if (allIssues.length === 0) {
    return (
      <div className="issues-panel">
        <h2>🎉 No Issues Detected</h2>
        <p className="no-issues-message">
          Your data looks clean! No anomalies or schema issues were found.
        </p>
      </div>
    );
  }

  return (
    <div className="issues-panel" role="region" aria-label="Data quality issues">
      <div className="panel-header">
        <h2>⚠️ Detected Issues ({allIssues.length})</h2>
        <div className="issue-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          >
            All ({allIssues.length})
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'anomaly'}
            onClick={() => setActiveTab('anomaly')}
            className={`tab ${activeTab === 'anomaly' ? 'active' : ''}`}
          >
            Anomalies ({anomalies.length})
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'schema'}
            onClick={() => setActiveTab('schema')}
            className={`tab ${activeTab === 'schema' ? 'active' : ''}`}
          >
            Schema ({schemaIssues.length})
          </button>
        </div>
      </div>

      <div className="issues-list" role="tabpanel">
        {filteredIssues.map((issue, idx) => (
          <div key={idx} className={`issue-card severity-${issue.severity}`}>
            <div className="issue-header">
              <div className="issue-title">
                <span className={`severity-badge ${issue.severity}`}>
                  {issue.severity.toUpperCase()}
                </span>
                <span className="issue-type">
                  {issue.category === 'anomaly' ? '📊 Anomaly' : '🔍 Schema'}
                </span>
              </div>
              <span className="column-name">{issue.column}</span>
            </div>

            <p className="issue-description">{issue.description}</p>

            {issue.recommendation && (
              <div className="issue-recommendation">
                <strong>💡 Recommendation:</strong> {issue.recommendation}
              </div>
            )}

            {issue.bounds && (
              <div className="issue-details">
                <strong>Expected range:</strong> {issue.bounds.lower} to {issue.bounds.upper}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
