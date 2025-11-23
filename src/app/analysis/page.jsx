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

export default function AnalysisPage() {
  const [data, setData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
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

        // Parse CSV
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: async (results) => {
            setData({ rows: results.data, fileName });
            
            // Perform analysis
            const analysisResults = analyzeData(results.data);
            setAnalysis(analysisResults);

            // Save to history
            saveAnalysisToHistory(fileName, analysisResults);

            // Get AI insights with sample data for deeper analysis
            try {
              const analysisWithSample = {
                ...analysisResults,
                sampleData: results.data.slice(0, 5) // Include first 5 rows for AI to analyze
              };
              const insights = await getAIInsights(analysisWithSample);
              setAIInsights(insights);
            } catch (aiError) {
              console.error('AI insights error:', aiError);
              setAIInsights({ error: 'Unable to generate AI insights' });
            }

            setIsLoading(false);
          },
          error: (error) => {
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
          <button onClick={() => router.push('/')} className="back-button">
            ← Upload New File
          </button>
        </header>

        {data && analysis && (
          <div className="analysis-content">
            <section className="section">
              <AnalysisHistory />
            </section>

            <section className="section">
              <QualityScore analysis={analysis} />
            </section>

            <section className="section">
              <DataPreview data={data.rows} fileName={data.fileName} />
            </section>

            {aiInsights && (
              <section className="section">
                <AIInsights insights={aiInsights} />
              </section>
            )}

            {(analysis.anomalies?.length > 0 || analysis.schemaIssues?.length > 0) && (
              <section className="section">
                <IssuesPanel 
                  anomalies={analysis.anomalies || []} 
                  schemaIssues={analysis.schemaIssues || []} 
                />
              </section>
            )}

            <section className="section">
              <SQLRecommendations analysis={analysis} />
            </section>

            <section className="section">
              <DataVisualizations analysis={analysis} />
            </section>

            <section className="section">
              <ColumnDetails analysis={analysis} />
            </section>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
