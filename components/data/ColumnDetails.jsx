'use client';

import { useState } from 'react';
import '../../styles/ColumnDetails.css';

export default function ColumnDetails({ analysis }) {
  const { columns } = analysis;
  const [expandedColumn, setExpandedColumn] = useState(null);

  const toggleColumn = (columnName) => {
    setExpandedColumn(expandedColumn === columnName ? null : columnName);
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') return value.toFixed(2);
    return String(value);
  };

  return (
    <div className="column-details">
      <h2>Column Details</h2>
      
      <div className="columns-list">
        {columns.map((column, idx) => (
          <div key={idx} className="column-card">
            <div 
              className="column-header"
              onClick={() => toggleColumn(column.name)}
            >
              <div className="column-title">
                <h3>{column.name}</h3>
                <span className={`type-badge ${column.type}`}>{column.type}</span>
              </div>
              <button className="expand-btn">
                {expandedColumn === column.name ? '−' : '+'}
              </button>
            </div>

            <div className="column-summary">
              <div className="summary-stat">
                <span className="stat-label">Missing:</span>
                <span className="stat-value">
                  {column.missingCount} ({column.missingPercentage.toFixed(1)}%)
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Unique:</span>
                <span className="stat-value">{column.uniqueCount}</span>
              </div>
            </div>

            {expandedColumn === column.name && (
              <div className="column-expanded">
                {column.type === 'number' && column.stats && (
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">Mean:</span>
                      <span className="stat-value">{formatValue(column.stats.mean)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Median:</span>
                      <span className="stat-value">{formatValue(column.stats.median)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Std Dev:</span>
                      <span className="stat-value">{formatValue(column.stats.stdDev)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Min:</span>
                      <span className="stat-value">{formatValue(column.stats.min)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Max:</span>
                      <span className="stat-value">{formatValue(column.stats.max)}</span>
                    </div>
                  </div>
                )}

                {column.topValues && column.topValues.length > 0 && (
                  <div className="top-values">
                    <h4>Top Values</h4>
                    <ul>
                      {column.topValues.map((item, idx) => (
                        <li key={idx}>
                          <span className="value-name">{String(item.value)}</span>
                          <span className="value-count">({item.count})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
