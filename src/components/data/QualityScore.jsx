'use client';

import HelpTooltip from '../HelpTooltip';
import '../../styles/QualityScore.css';

export default function QualityScore({ analysis }) {
  const { qualityScore, summary } = analysis;

  const getScoreLevel = (score) => {
    if (score >= 80) return { level: 'excellent', label: 'Excellent' };
    if (score >= 60) return { level: 'good', label: 'Good' };
    if (score >= 40) return { level: 'fair', label: 'Fair' };
    return { level: 'poor', label: 'Poor' };
  };

  const scoreInfo = getScoreLevel(qualityScore);

  return (
    <div className="quality-score">
      <h2>
        Data Quality Score
        <HelpTooltip 
          title="What is Quality Score?"
          content="A 0-100 score based on data completeness, duplicate detection, and column variance. Higher scores indicate better data quality."
        />
      </h2>
      
      <div className={`score-display ${scoreInfo.level}`}>
        <div className="score-circle">
          <svg viewBox="0 0 100 100">
            <circle
              className="score-bg"
              cx="50"
              cy="50"
              r="45"
            />
            <circle
              className="score-fill"
              cx="50"
              cy="50"
              r="45"
              style={{
                strokeDasharray: `${qualityScore * 2.827}, 282.7`,
              }}
            />
          </svg>
          <div className="score-text">
            <span className="score-number">{qualityScore}</span>
            <span className="score-label">{scoreInfo.label}</span>
          </div>
        </div>
      </div>

      <div className="quality-summary">
        <div className="summary-item">
          <span className="summary-label">Total Rows:</span>
          <span className="summary-value">{summary.totalRows}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Columns:</span>
          <span className="summary-value">{summary.totalColumns}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">
            Completeness:
            <HelpTooltip content="Percentage of cells with valid data (non-empty, non-null values)." />
          </span>
          <span className="summary-value">{summary.completeness.toFixed(1)}%</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Missing Values:</span>
          <span className="summary-value">{summary.totalMissing}</span>
        </div>
      </div>

      <div className="quality-issues">
        <h3>Quality Assessment</h3>
        <ul>
          {summary.completeness < 90 && (
            <li className="issue warning">
              Data has {(100 - summary.completeness).toFixed(1)}% missing values
            </li>
          )}
          {summary.duplicateRows > 0 && (
            <li className="issue warning">
              Found {summary.duplicateRows} duplicate rows
            </li>
          )}
          {summary.completeness >= 95 && summary.duplicateRows === 0 && (
            <li className="issue success">
              Data is clean with minimal issues
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
