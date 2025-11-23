'use client';

import '../../styles/AIInsights.css';

export default function AIInsights({ insights }) {
  if (insights?.error) {
    return (
      <div className="ai-insights">
        <h2>AI Insights</h2>
        <div className="insights-error">
          <p>{insights.error}</p>
          <p className="error-hint">
            Make sure your OpenAI API key is configured in .env.local
          </p>
        </div>
      </div>
    );
  }

  if (!insights || !insights.recommendations) {
    return (
      <div className="ai-insights">
        <h2>AI Insights</h2>
        <div className="insights-loading">Generating insights...</div>
      </div>
    );
  }

  return (
    <div className="ai-insights">
      <div className="insights-header">
        <h2>🤖 AI-Powered Insights</h2>
        <span className="ai-badge">Powered by OpenAI</span>
      </div>

      {insights.summary && (
        <div className="insights-summary">
          <h3>Summary</h3>
          <p>{insights.summary}</p>
        </div>
      )}

      {insights.dataCharacteristics && insights.dataCharacteristics.length > 0 && (
        <div className="insights-section">
          <h3>📊 Data Characteristics</h3>
          <ul className="insights-list">
            {insights.dataCharacteristics.map((char, idx) => (
              <li key={idx} className="insight-item">
                <span className="insight-icon">📈</span>
                <span>{char}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights.dataQualityIssues && insights.dataQualityIssues.length > 0 && (
        <div className="insights-section">
          <h3>⚠️ Data Quality Issues</h3>
          <ul className="insights-list issues">
            {insights.dataQualityIssues.map((issue, idx) => (
              <li key={idx} className="insight-item issue">
                <span className="insight-icon">⚠️</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights.recommendations && insights.recommendations.length > 0 && (
        <div className="insights-section">
          <h3>💡 Recommendations</h3>
          <ul className="insights-list">
            {insights.recommendations.map((rec, idx) => (
              <li key={idx} className="insight-item">
                <span className="insight-icon">💡</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights.potentialCorrelations && insights.potentialCorrelations.length > 0 && (
        <div className="insights-section">
          <h3>🔗 Potential Correlations</h3>
          <ul className="insights-list">
            {insights.potentialCorrelations.map((corr, idx) => (
              <li key={idx} className="insight-item">
                <span className="insight-icon">🔗</span>
                <span>{corr}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights.businessInsights && insights.businessInsights.length > 0 && (
        <div className="insights-section">
          <h3>💼 Business Insights</h3>
          <ul className="insights-list">
            {insights.businessInsights.map((insight, idx) => (
              <li key={idx} className="insight-item">
                <span className="insight-icon">💼</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights.potentialUseCases && insights.potentialUseCases.length > 0 && (
        <div className="insights-section">
          <h3>🎯 Potential Use Cases</h3>
          <ul className="insights-list">
            {insights.potentialUseCases.map((useCase, idx) => (
              <li key={idx} className="insight-item">
                <span className="insight-icon">🎯</span>
                <span>{useCase}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
