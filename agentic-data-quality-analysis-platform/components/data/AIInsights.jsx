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

      {summary && <div><h3>Summary</h3><p>{summary}</p></div>}

      {dataCharacteristics.length > 0 && <ul>{dataCharacteristics.map((c,i)=><li key={i}>📈 {c}</li>)}</ul>}
      {dataQualityIssues.length > 0 && <ul>{dataQualityIssues.map((i,idx)=><li key={idx}>⚠️ {i}</li>)}</ul>}
      {recommendations.length > 0 && <ul>{recommendations.map((r,idx)=><li key={idx}>💡 {r}</li>)}</ul>}
      {potentialCorrelations.length > 0 && <ul>{potentialCorrelations.map((p,idx)=><li key={idx}>🔗 {p}</li>)}</ul>}
      {businessInsights.length > 0 && <ul>{businessInsights.map((b,idx)=><li key={idx}>💼 {b}</li>)}</ul>}
      {potentialUseCases.length > 0 && <ul>{potentialUseCases.map((u,idx)=><li key={idx}>🎯 {u}</li>)}</ul>}
    </div>
  );
}
