'use client';

import { useState } from 'react';
import '../../styles/DataPreview.css';

export default function DataPreview({ data, fileName }) {
  const [showAll, setShowAll] = useState(false);
  const previewRows = showAll ? data : data.slice(0, 10);
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="data-preview">
      <div className="preview-header">
        <h2>Data Preview</h2>
        <div className="preview-info">
          <span className="file-name">{fileName}</span>
          <span className="row-count">{data.length} rows</span>
          <span className="col-count">{columns.length} columns</span>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="row-number">#</th>
              {columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td className="row-number">{rowIdx + 1}</td>
                {columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {row[col] !== null && row[col] !== undefined 
                      ? String(row[col]) 
                      : <span className="null-value">null</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 10 && (
        <button 
          className="show-more-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : `Show All ${data.length} Rows`}
        </button>
      )}
    </div>
  );
}
