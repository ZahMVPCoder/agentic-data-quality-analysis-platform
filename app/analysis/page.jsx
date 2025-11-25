'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import DataPreview from '../../components/data/DataPreview';
import QualityScore from '../../components/data/QualityScore';
import AIInsights from '../../components/data/AIInsights';
import DataVisualizations from '../../components/data/DataVisualizations';
import ColumnDetails from '../../components/data/ColumnDetails';
import IssuesPanel from '../../components/data/IssuesPanel';
import SQLRecommendations from '../../components/data/SQLRecommendations';
import ErrorBoundary from '../../components/ErrorBoundary';
import AnalysisHistory from '../../components/AnalysisHistory';
import { analyzeData } from '../../lib/dataAnalysis';
import { getAIInsights } from '../../lib/aiIntegration';
import { saveAnalysisToHistory } from '../../lib/historyTracker';
import '../../styles/AnalysisPage.css';

export default function AnalysisPage({ analysis: initialAnalysis }) {
  const [data, setData] = useState(null);
  const [analysisData, setAnalysisData] = useState(initialAnalysis || null);
  const [aiInsights, setAIInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvData = sessionStorage.getItem('uploadedData');
        const fileName = sessionStorage.getItem('fileName');

        if (!csvData) {
          router.push('/');
          return;
        }

        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: async (results) => {
            setData({ rows: results.data, fileName });
            
            const analysisResults = analyzeData(results.data);
            setAnalysisData(analysisResults);

            saveAnalysisToHistory(fileName, analysisResults);
            setIsLoading(false);
          },
          error: () => {
            setError('Error parsing CSV file');
            setIsLoading(false);
          },
        });
      } catch (err) {
        setError('Error loading data');
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

   useEffect(() => {
    if (analysisData) {
      getAIInsights(analysisData).then(setAIInsights);
    }
  }, [analysisData]);

  if (isLoading) return <div className="analysis-container"><div className="loading">Analyzing your data...</div></div>;
  if (error) return <div className="analysis-container"><div className="error">{error}</div><button onClick={() => router.push('/')}>Back to Home</button></div>;


  if (isLoading) {
    return (
      <div className="analysis-container">
        <div className="loading">Analyzing your data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-container">
        <div className="error">{error}</div>
        <button onClick={() => router.push('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="analysis-container">
        <header className="analysis-header">
          <h1 onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>Data Quality Analysis</h1>
          <button onClick={() => router.push('/')} className="back-button">← Upload New File</button>
        </header>

        {data && analysisData && (
          <div className="analysis-content">
            <section className="section"><AnalysisHistory /></section>
            <section className="section"><QualityScore analysis={analysisData} /></section>
            <section className="section"><DataPreview data={data.rows} fileName={data.fileName} /></section>
            <section className="section"><AIInsights insights={aiInsights} /></section>

            {(analysisData.anomalies?.length > 0 || analysisData.schemaIssues?.length > 0) && (
              <section className="section">
                <IssuesPanel anomalies={analysisData.anomalies || []} schemaIssues={analysisData.schemaIssues || []} />
              </section>
            )}

            <section className="section"><SQLRecommendations analysis={analysisData} /></section>
            <section className="section"><DataVisualizations analysis={analysisData} /></section>
            <section className="section"><ColumnDetails analysis={analysisData} /></section>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}