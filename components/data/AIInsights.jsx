'use client';
import React from 'react';
import '../../styles/AIInsights.css';

export default function AIInsights({ insights }) {
  if (!insights) {
    return <div className="ai-insights">Generating insights...</div>;
  }

  if (insights.error) {
    return <div className="ai-insights error">{insights.error}</div>;
  }

  const {
    summary,
    dataCharacteristics = [],
    dataQualityIssues = [],
    recommendations = [],
    potentialCorrelations = [],
    businessInsights = [],
    potentialUseCases = [],
  } = insights;

  return (
    <div className="ai-insights">
      <h2>🤖 AI Insights</h2>

      {summary && (
        <div className="insight-section">
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>
      )}

      {dataCharacteristics.length > 0 && (
        <div className="insight-section">
          <h3>📊 Data Characteristics</h3>
          <ul>
            {dataCharacteristics.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="insight-section">
          <h3>💡 Recommendations</h3>
          <ul>
            {recommendations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {dataQualityIssues.length > 0 && (
        <div className="insight-section">
          <h3>⚠️ Data Quality Issues</h3>
          <ul>
            {dataQualityIssues.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {potentialCorrelations.length > 0 && (
        <div className="insight-section">
          <h3>🔗 Potential Correlations</h3>
          <ul>
            {potentialCorrelations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {businessInsights.length > 0 && (
        <div className="insight-section">
          <h3>💼 Business Insights</h3>
          <ul>
            {businessInsights.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {potentialUseCases.length > 0 && (
        <div className="insight-section">
          <h3>🎯 Potential Use Cases</h3>
          <ul>
            {potentialUseCases.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
