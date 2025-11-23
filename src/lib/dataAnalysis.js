/**
 * Core data analysis functions
 */

export function analyzeData(data) {
  if (!data || data.length === 0) {
    throw new Error('No data provided for analysis');
  }

  const columns = Object.keys(data[0]);
  const totalRows = data.length;
  const totalColumns = columns.length;

  // Analyze each column
  const columnAnalysis = columns.map(columnName => {
    return analyzeColumn(data, columnName);
  });

  // Calculate summary statistics
  const totalMissing = columnAnalysis.reduce(
    (sum, col) => sum + col.missingCount,
    0
  );
  
  const totalCells = totalRows * totalColumns;
  const completeness = ((totalCells - totalMissing) / totalCells) * 100;

  // Detect duplicate rows
  const duplicateRows = detectDuplicates(data);

  // Detect anomalies across all columns
  const anomalies = detectAnomalies(columnAnalysis, data);

  // Detect schema issues
  const schemaIssues = detectSchemaIssues(columnAnalysis, data);

  // Calculate quality score
  const qualityScore = calculateQualityScore({
    completeness,
    duplicateRows,
    totalRows,
    columnAnalysis,
    anomalies,
    schemaIssues,
  });

  return {
    summary: {
      totalRows,
      totalColumns,
      totalMissing,
      completeness,
      duplicateRows,
    },
    columns: columnAnalysis,
    qualityScore,
    anomalies,
    schemaIssues,
  };
}

function analyzeColumn(data, columnName) {
  const values = data.map(row => row[columnName]);
  const validValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  const missingCount = data.length - validValues.length;
  const missingPercentage = (missingCount / data.length) * 100;

  // Detect data type
  const type = detectDataType(validValues);

  // Count unique values
  const uniqueValues = new Set(validValues);
  const uniqueCount = uniqueValues.size;

  // Get top values
  const topValues = getTopValues(validValues, 5);

  // Calculate statistics for numeric columns
  let stats = null;
  if (type === 'number') {
    stats = calculateNumericStats(validValues);
  }

  return {
    name: columnName,
    type,
    missingCount,
    missingPercentage,
    uniqueCount,
    topValues,
    stats,
  };
}

function detectDataType(values) {
  if (values.length === 0) return 'unknown';

  const sampleSize = Math.min(100, values.length);
  const sample = values.slice(0, sampleSize);

  let numberCount = 0;
  let dateCount = 0;
  let booleanCount = 0;

  sample.forEach(value => {
    if (typeof value === 'number' || !isNaN(Number(value))) {
      numberCount++;
    }
    if (isDate(value)) {
      dateCount++;
    }
    if (typeof value === 'boolean' || 
        (typeof value === 'string' && ['true', 'false', 'yes', 'no'].includes(value.toLowerCase()))) {
      booleanCount++;
    }
  });

  const threshold = sampleSize * 0.8;

  if (numberCount >= threshold) return 'number';
  if (dateCount >= threshold) return 'date';
  if (booleanCount >= threshold) return 'boolean';
  return 'string';
}

function isDate(value) {
  if (!value) return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
}

function getTopValues(values, limit = 5) {
  const counts = {};
  values.forEach(value => {
    const key = String(value);
    counts[key] = (counts[key] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function calculateNumericStats(values) {
  const numbers = values.map(Number).filter(n => !isNaN(n));
  
  if (numbers.length === 0) return null;

  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / numbers.length;
  
  const median = numbers.length % 2 === 0
    ? (sorted[numbers.length / 2 - 1] + sorted[numbers.length / 2]) / 2
    : sorted[Math.floor(numbers.length / 2)];

  const variance = numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numbers.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean,
    median,
    stdDev,
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

function detectDuplicates(data) {
  const seen = new Set();
  let duplicates = 0;

  data.forEach(row => {
    const key = JSON.stringify(row);
    if (seen.has(key)) {
      duplicates++;
    } else {
      seen.add(key);
    }
  });

  return duplicates;
}

function detectAnomalies(columnAnalysis, data) {
  const anomalies = [];

  columnAnalysis.forEach(col => {
    if (col.type === 'number' && col.stats) {
      // Use IQR method for outlier detection
      const values = data.map(row => row[col.name]).filter(v => v !== null && v !== undefined && !isNaN(v));
      const sorted = [...values].sort((a, b) => a - b);
      
      const q1Index = Math.floor(sorted.length * 0.25);
      const q3Index = Math.floor(sorted.length * 0.75);
      const q1 = sorted[q1Index];
      const q3 = sorted[q3Index];
      const iqr = q3 - q1;
      
      const lowerBound = q1 - (1.5 * iqr);
      const upperBound = q3 + (1.5 * iqr);
      
      const outliers = values.filter(v => v < lowerBound || v > upperBound);
      
      if (outliers.length > 0) {
        const outlierPercentage = (outliers.length / values.length) * 100;
        if (outlierPercentage > 5) { // Only flag if >5% are outliers
          anomalies.push({
            column: col.name,
            type: 'outliers',
            count: outliers.length,
            percentage: outlierPercentage,
            severity: outlierPercentage > 15 ? 'high' : 'medium',
            description: `${outliers.length} outlier values detected (${outlierPercentage.toFixed(1)}%)`,
            bounds: { lower: lowerBound.toFixed(2), upper: upperBound.toFixed(2) },
          });
        }
      }
    }

    // Check for unusual patterns in string data
    if (col.type === 'string') {
      const avgLength = data
        .map(row => row[col.name])
        .filter(v => v !== null && v !== undefined)
        .reduce((sum, v) => sum + String(v).length, 0) / (data.length - col.missingCount);
      
      if (avgLength > 100) {
        anomalies.push({
          column: col.name,
          type: 'unusual_length',
          severity: 'low',
          description: `Unusually long text values (avg ${Math.round(avgLength)} characters)`,
        });
      }
    }
  });

  return anomalies;
}

function detectSchemaIssues(columnAnalysis, data) {
  const issues = [];

  columnAnalysis.forEach(col => {
    // Check for mixed data types
    if (col.type === 'string') {
      const values = data.map(row => row[col.name]).filter(v => v !== null && v !== undefined && v !== '');
      let numericCount = 0;
      let dateCount = 0;
      
      values.forEach(val => {
        if (!isNaN(Number(val))) numericCount++;
        if (isDate(val)) dateCount++;
      });
      
      const numericPercentage = (numericCount / values.length) * 100;
      const datePercentage = (dateCount / values.length) * 100;
      
      if (numericPercentage > 30 && numericPercentage < 70) {
        issues.push({
          column: col.name,
          type: 'mixed_types',
          severity: 'high',
          description: `Column contains mixed data types: ${numericPercentage.toFixed(0)}% numeric, ${(100-numericPercentage).toFixed(0)}% text`,
          recommendation: 'Consider separating into multiple columns or standardizing format',
        });
      }
      
      if (datePercentage > 30 && datePercentage < 70) {
        issues.push({
          column: col.name,
          type: 'inconsistent_dates',
          severity: 'medium',
          description: `Column has inconsistent date formats`,
          recommendation: 'Standardize date format (e.g., YYYY-MM-DD)',
        });
      }
    }

    // Check for high cardinality that might indicate unique identifiers
    const uniquePercentage = (col.uniqueCount / (data.length - col.missingCount)) * 100;
    if (uniquePercentage > 95 && col.type === 'string') {
      issues.push({
        column: col.name,
        type: 'high_cardinality',
        severity: 'low',
        description: `Column appears to be a unique identifier (${uniquePercentage.toFixed(0)}% unique)`,
        recommendation: 'Consider using as primary key or removing if not needed for analysis',
      });
    }

    // Check for suspicious missing value patterns
    if (col.missingPercentage > 50) {
      issues.push({
        column: col.name,
        type: 'excessive_missing',
        severity: 'high',
        description: `Column has ${col.missingPercentage.toFixed(1)}% missing values`,
        recommendation: 'Consider dropping this column or investigating data collection process',
      });
    }
  });

  return issues;
}

function calculateQualityScore({ completeness, duplicateRows, totalRows, columnAnalysis, anomalies, schemaIssues }) {
  let score = 100;

  // Penalize for missing data
  score -= (100 - completeness) * 0.5;

  // Penalize for duplicates
  const duplicatePercentage = (duplicateRows / totalRows) * 100;
  score -= duplicatePercentage * 0.3;

  // Penalize for anomalies
  if (anomalies && anomalies.length > 0) {
    score -= Math.min(15, anomalies.length * 2);
  }

  // Penalize for schema issues
  if (schemaIssues && schemaIssues.length > 0) {
    score -= Math.min(10, schemaIssues.length * 3);
  }

  // Penalize for columns with too many unique values (potential data quality issues)
  columnAnalysis.forEach(col => {
    if (col.uniqueCount === 1) {
      score -= 2; // Column has no variance
    }
  });

  return Math.max(0, Math.min(100, Math.round(score)));
}
