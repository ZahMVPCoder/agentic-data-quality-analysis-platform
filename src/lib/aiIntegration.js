/**
 * Client-side wrapper for AI insights API
 * Makes a secure call to the server-side API route
 */

export async function getAIInsights(analysis) {
  try {
    const response = await fetch('/api/ai-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analysis),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get AI insights');
    }

    const insights = await response.json();
    return insights;
  } catch (error) {
    console.error('Error getting AI insights:', error);
    throw error;
  }
}

