'use client';

import { useCallback, useState } from 'react';
import '../styles/FileUpload.css';

export default function FileUpload({ onFileUpload, isProcessing }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = (file) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }
    setFileName(file.name);
    onFileUpload(file);
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="region"
        aria-label="File upload area"
      >
        <input
          type="file"
          id="file-input"
          accept=".csv"
          onChange={handleChange}
          disabled={isProcessing}
          className="file-input"
          aria-label="Upload CSV file"
          aria-describedby="upload-instructions"
        />
        <label htmlFor="file-input" className="file-label" id="upload-instructions">
          {isProcessing ? (
            <>
              <div className="spinner"></div>
              <p>Processing {fileName}...</p>
            </>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <p className="upload-text">
                Drag and drop your CSV file here, or click to browse
              </p>
              <p className="upload-hint">Maximum file size: 10MB</p>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
