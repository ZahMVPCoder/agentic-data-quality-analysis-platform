'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '../components/FileUpload';
import { getHistory } from '../lib/historyTracker';
import '../styles/HomePage.css';

export default function HomePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    try {
      // Store file data in sessionStorage for the analysis page
      const text = await file.text();
      sessionStorage.setItem('uploadedData', text);
      sessionStorage.setItem('fileName', file.name);
      
      // Navigate to analysis page
      router.push('/analysis');
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="home-container">
      <nav className="top-nav">
        <div className="nav-brand">[ Logo ] Data Quality Analysis</div>
        <div className="nav-links">
          <a href="#" className="nav-link">[ Home ]</a>
          <a href="#" className="nav-link">[ About ]</a>
          <a href="#" className="nav-link">[ Docs ]</a>
        </div>
      </nav>

      <div className="home-main" role="main">
        <div className="upload-section">
          <h1 className="upload-title">Upload Your Dataset</h1>
          <p className="upload-subtitle">Instant AI-Powered Quality Analysis</p>
          
          <FileUpload 
            onFileUpload={handleFileUpload}
            isProcessing={isProcessing}
          />
        </div>

        {history.length > 0 && (
          <div className="recent-analyses">
            <h2>Recent Analyses:</h2>
            <div className="analyses-list">
              {history.slice(0, 3).map((item) => (
                <div key={item.id} className="analysis-item">
                  <span className="file-icon">📊</span>
                  <div className="analysis-details">
                    <strong>{item.fileName}</strong>
                    <span className="score-badge">Score: {item.qualityScore} ({getScoreLabel(item.qualityScore)})</span>
                    <div className="analysis-time">Analyzed: {formatTimeAgo(item.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="quick-tips">
              <strong>Quick Tips:</strong>
              <p>• Ensure column headers are in first row</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
