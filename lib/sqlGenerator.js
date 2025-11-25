/**
 * Generate SQL cleanup and optimization queries
 */

export function generateSQLRecommendations(analysis, tableName = 'your_table') {
  const recommendations = [];

  // Handle missing values
  if (analysis.summary.totalMissing > 0) {
    const columnsWithMissing = analysis.columns
      .filter(col => col.missingCount > 0)
      .sort((a, b) => b.missingPercentage - a.missingPercentage);

    if (columnsWithMissing.length > 0) {
      recommendations.push({
        issue: 'Missing Values',
        description: `Found ${analysis.summary.totalMissing} missing values across ${columnsWithMissing.length} columns`,
        queries: [
          {
            title: 'Identify rows with missing values',
            sql: `-- Find rows with any NULL values\nSELECT *\nFROM ${tableName}\nWHERE ${columnsWithMissing.map(col => `${col.name} IS NULL`).join('\n   OR ')};`,
            explanation: 'Lists all rows that have at least one missing value',
          },
          {
            title: 'Remove rows with missing values',
            sql: `-- Delete rows with NULL values (use with caution)\nDELETE FROM ${tableName}\nWHERE ${columnsWithMissing.map(col => `${col.name} IS NULL`).join('\n   OR ')};`,
            explanation: 'Removes rows with any NULL values. Back up your data first!',
          },
          {
            title: 'Fill missing numeric values with average',
            sql: columnsWithMissing
              .filter(col => col.type === 'number' && col.stats)
              .map(col => 
                `-- Fill NULL values in ${col.name} with average\nUPDATE ${tableName}\nSET ${col.name} = ${col.stats.mean.toFixed(2)}\nWHERE ${col.name} IS NULL;`
              )
              .join('\n\n'),
            explanation: 'Replaces NULL numeric values with column average (mean imputation)',
          },
        ],
      });
    }
  }

  // Handle duplicates
  if (analysis.summary.duplicateRows > 0) {
    recommendations.push({
      issue: 'Duplicate Rows',
      description: `Found ${analysis.summary.duplicateRows} duplicate rows`,
      queries: [
        {
          title: 'Find duplicate rows',
          sql: `-- Identify duplicate rows\nSELECT ${analysis.columns.map(c => c.name).join(', ')}, COUNT(*) as duplicate_count\nFROM ${tableName}\nGROUP BY ${analysis.columns.map(c => c.name).join(', ')}\nHAVING COUNT(*) > 1;`,
          explanation: 'Shows all rows that appear more than once with their count',
        },
        {
          title: 'Remove duplicates (keep first occurrence)',
          sql: `-- Remove duplicate rows, keeping only the first occurrence\nDELETE FROM ${tableName}\nWHERE rowid NOT IN (\n  SELECT MIN(rowid)\n  FROM ${tableName}\n  GROUP BY ${analysis.columns.map(c => c.name).join(', ')}\n);`,
          explanation: 'Deletes duplicate rows, keeping only the first occurrence of each unique row',
        },
      ],
    });
  }

  // Handle anomalies (outliers)
  if (analysis.anomalies && analysis.anomalies.length > 0) {
    const outlierColumns = analysis.anomalies.filter(a => a.type === 'outliers');
    
    if (outlierColumns.length > 0) {
      recommendations.push({
        issue: 'Outliers Detected',
        description: `Found outliers in ${outlierColumns.length} numeric columns`,
        queries: outlierColumns.map(anomaly => ({
          title: `Find outliers in ${anomaly.column}`,
          sql: `-- Find outlier values in ${anomaly.column}\nSELECT *\nFROM ${tableName}\nWHERE ${anomaly.column} < ${anomaly.bounds.lower}\n   OR ${anomaly.column} > ${anomaly.bounds.upper};`,
          explanation: `Shows rows where ${anomaly.column} is outside normal range (${anomaly.bounds.lower} to ${anomaly.bounds.upper})`,
        })),
      });
    }
  }

  // Handle schema issues
  if (analysis.schemaIssues && analysis.schemaIssues.length > 0) {
    const excessiveMissing = analysis.schemaIssues.filter(i => i.type === 'excessive_missing');
    
    if (excessiveMissing.length > 0) {
      recommendations.push({
        issue: 'Columns with Excessive Missing Values',
        description: `${excessiveMissing.length} columns have >50% missing data`,
        queries: [
          {
            title: 'Drop columns with too many missing values',
            sql: excessiveMissing.map(issue => 
              `-- Drop ${issue.column} (${issue.description})\nALTER TABLE ${tableName}\nDROP COLUMN ${issue.column};`
            ).join('\n\n'),
            explanation: 'Removes columns that are mostly empty and unlikely to be useful',
          },
        ],
      });
    }

    const mixedTypes = analysis.schemaIssues.filter(i => i.type === 'mixed_types');
    if (mixedTypes.length > 0) {
      recommendations.push({
        issue: 'Mixed Data Types',
        description: `${mixedTypes.length} columns contain inconsistent data types`,
        queries: mixedTypes.map(issue => ({
          title: `Clean ${issue.column} data types`,
          sql: `-- Find non-numeric values in ${issue.column}\nSELECT ${issue.column}, COUNT(*) as count\nFROM ${tableName}\nWHERE ${issue.column} IS NOT NULL\n  AND CAST(${issue.column} AS TEXT) NOT LIKE '%[0-9]%'\nGROUP BY ${issue.column};`,
          explanation: `Identifies values in ${issue.column} that don't match expected numeric format`,
        })),
      });
    }
  }

  // General optimization
  recommendations.push({
    issue: 'General Optimization',
    description: 'Improve query performance and data integrity',
    queries: [
      {
        title: 'Add indexes for better performance',
        sql: analysis.columns
          .filter(col => col.uniqueCount > 10)
          .slice(0, 3)
          .map(col => `CREATE INDEX idx_${col.name} ON ${tableName}(${col.name});`)
          .join('\n'),
        explanation: 'Creates indexes on columns with good cardinality for faster queries',
      },
      {
        title: 'Analyze table statistics',
        sql: `-- Update table statistics for query optimizer\nANALYZE ${tableName};`,
        explanation: 'Updates database statistics to help the query planner make better decisions',
      },
    ],
  });

  return recommendations;
}
