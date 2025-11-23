/**
 * Track data quality history across multiple uploads
 */

const HISTORY_KEY = 'dataQualityHistory';
const MAX_HISTORY_ITEMS = 10;

export function saveAnalysisToHistory(fileName, analysis) {
  try {
    const history = getHistory();
    
    const entry = {
      id: Date.now(),
      fileName,
      timestamp: new Date().toISOString(),
      qualityScore: analysis.qualityScore,
      summary: {
        totalRows: analysis.summary.totalRows,
        totalColumns: analysis.summary.totalColumns,
        completeness: analysis.summary.completeness,
        duplicateRows: analysis.summary.duplicateRows,
      },
    };

    // Add to beginning and limit to MAX_HISTORY_ITEMS
    history.unshift(entry);
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
    return entry;
  } catch (error) {
    console.error('Error saving to history:', error);
    return null;
  }
}

export function getHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
}

export function getQualityTrend() {
  const history = getHistory();
  if (history.length < 2) return null;

  const recent = history.slice(0, 5);
  const scores = recent.map(item => item.qualityScore);
  const avgRecent = scores.reduce((a, b) => a + b, 0) / scores.length;

  return {
    averageScore: avgRecent,
    trend: scores[0] > scores[scores.length - 1] ? 'improving' : 'declining',
    totalAnalyses: history.length,
  };
}
