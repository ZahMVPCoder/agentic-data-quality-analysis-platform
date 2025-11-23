import { NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * Server-side API route for generating AI insights
 * This keeps the API key secure on the server
 */

export async function POST(request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const analysis = await request.json();

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const prompt = buildPrompt(analysis);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert data scientist and business intelligence analyst. Provide deep, actionable insights about data quality, patterns, relationships, and business opportunities. Analyze the actual data values, distributions, and correlations. Respond in JSON format with keys: summary, dataCharacteristics (array), recommendations (array), dataQualityIssues (array), potentialCorrelations (array), businessInsights (array), and potentialUseCases (array).',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const content = response.choices[0].message.content;
    
    // Parse JSON response
    try {
      const insights = JSON.parse(content);
      return NextResponse.json(insights);
    } catch (parseError) {
      // If JSON parsing fails, create structured response from text
      const insights = {
        summary: content,
        dataCharacteristics: extractListItems(content, 'characteristic'),
        recommendations: extractListItems(content, 'recommendation'),
        dataQualityIssues: extractListItems(content, 'issue'),
        potentialCorrelations: extractListItems(content, 'correlation'),
        businessInsights: extractListItems(content, 'insight'),
        potentialUseCases: extractListItems(content, 'use case'),
      };
      return NextResponse.json(insights);
    }
  } catch (error) {
    console.error('Error getting AI insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI insights: ' + error.message },
      { status: 500 }
    );
  }
}

function buildPrompt(analysis) {
  const { summary, columns, qualityScore, anomalies = [], schemaIssues = [], sampleData = [] } = analysis;

  // Enhanced column analysis with statistics and patterns
  const columnSummary = columns
    .map(col => {
      let details = `- **${col.name}** (${col.type}):\n`;
      details += `  - Missing: ${col.missingPercentage.toFixed(1)}% (${col.missingCount} values)\n`;
      details += `  - Unique values: ${col.uniqueCount}`;
      
      if (col.stats) {
        details += `\n  - Statistics: Min=${col.stats.min}, Max=${col.stats.max}, Mean=${col.stats.mean.toFixed(2)}, Median=${col.stats.median}, StdDev=${col.stats.stdDev.toFixed(2)}`;
      }
      
      if (col.topValues && col.topValues.length > 0) {
        const topValuesStr = col.topValues
          .slice(0, 3)
          .map(v => `"${v.value}" (${v.count})`)
          .join(', ');
        details += `\n  - Top values: ${topValuesStr}`;
      }
      
      return details;
    })
    .join('\n');

  const anomalySummary = anomalies.length > 0
    ? `\n\n**Anomalies Detected:**\n${anomalies.map(a => `- ${a.column}: ${a.description}${a.bounds ? ` [bounds: ${a.bounds.lower} to ${a.bounds.upper}]` : ''}`).join('\n')}`
    : '';

  const schemaSummary = schemaIssues.length > 0
    ? `\n\n**Schema Issues:**\n${schemaIssues.map(s => `- ${s.column} (${s.severity}): ${s.description}\n  Recommendation: ${s.recommendation}`).join('\n')}`
    : '';

  const sampleDataSection = sampleData && sampleData.length > 0
    ? `\n\n**Sample Data Preview (first 5 rows):**\n${JSON.stringify(sampleData, null, 2)}`
    : '';

  return `
Perform a deep analysis of this dataset and provide comprehensive insights:

**Overall Quality Score: ${qualityScore}/100**

**Dataset Summary:**
- Total Rows: ${summary.totalRows}
- Total Columns: ${summary.totalColumns}
- Completeness: ${summary.completeness.toFixed(1)}%
- Missing Values: ${summary.totalMissing} (${((summary.totalMissing / (summary.totalRows * summary.totalColumns)) * 100).toFixed(1)}% of all cells)
- Duplicate Rows: ${summary.duplicateRows} (${((summary.duplicateRows / summary.totalRows) * 100).toFixed(1)}%)

**Column Details:**
${columnSummary}${anomalySummary}${schemaSummary}${sampleDataSection}

**Analysis Requirements:**

1. **Data Characteristics**: Identify 3-4 key characteristics about this dataset (size, structure, data types, distributions, patterns in the actual values)

2. **Deep Quality Analysis**: Beyond basic metrics, identify subtle quality issues like:
   - Suspicious patterns or inconsistencies in the data values
   - Potential data entry errors
   - Biases in distributions
   - Temporal or logical inconsistencies

3. **Actionable Recommendations**: Provide 5-7 specific, prioritized recommendations for:
   - Data cleaning steps
   - Validation rules to implement
   - Data collection improvements
   - Feature engineering opportunities

4. **Potential Correlations**: Based on column names, types, and distributions, suggest 3-4 likely relationships or correlations worth investigating

5. **Business Insights**: Provide 3-4 business-oriented insights about what this data reveals (e.g., customer behavior, operational patterns, trends)

6. **Advanced Use Cases**: Suggest 4-5 sophisticated analyses or ML applications possible with this data

Format your response as JSON:
{
  "summary": "Comprehensive 3-4 sentence overview analyzing the dataset's nature, quality, and potential value",
  "dataCharacteristics": ["characteristic 1", "characteristic 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "dataQualityIssues": ["critical issue 1", "issue 2", ...],
  "potentialCorrelations": ["correlation insight 1", "correlation 2", ...],
  "businessInsights": ["business insight 1", "insight 2", ...],
  "potentialUseCases": ["advanced use case 1", "use case 2", ...]
}
`;
}

function extractListItems(text, keyword) {
  const lines = text.split('\n');
  const items = [];
  
  let inSection = false;
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().includes(keyword)) {
      inSection = true;
    } else if (trimmed.match(/^[-•*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      if (inSection) {
        items.push(trimmed.replace(/^[-•*\d.]\s+/, ''));
      }
    }
  });

  return items.length > 0 ? items : ['No specific items identified'];
}
