'use client';

import { useState } from 'react';
import '../styles/HelpTooltip.css';

export default function HelpTooltip({ content, title }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="help-tooltip-container">
      <button
        className="help-button"
        onClick={() => setIsVisible(!isVisible)}
        onBlur={() => setTimeout(() => setIsVisible(false), 200)}
        aria-label={`Help: ${title}`}
        aria-expanded={isVisible}
        aria-haspopup="true"
      >
        ?
      </button>
      {isVisible && (
        <div className="help-tooltip" role="tooltip">
          {title && <strong>{title}</strong>}
          <p>{content}</p>
        </div>
      )}
    </div>
  );
}
