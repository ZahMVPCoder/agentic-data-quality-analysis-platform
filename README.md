This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Agentic Data Quality Analysis Platform

AI-powered data quality analysis tool designed for business users, data analysts, and non-technical teams.

## ✨ Features

### Automated Analysis
- **30-second uploads**: Quick CSV file processing
- **Instant quality scoring**: 0-100 score calculated in under 5 seconds
- **AI-powered insights**: OpenAI-generated recommendations for non-technical users
- **Anomaly detection**: Automatic outlier detection using IQR method
- **Schema validation**: Identifies mixed types, inconsistent formats, and data issues

### SQL Cleanup Recommendations
- **Ready-to-use SQL**: Copy-paste queries to clean your data
- **Handle missing values**: Fill, remove, or impute missing data
- **Remove duplicates**: SQL queries to identify and delete duplicate rows
- **Fix outliers**: Find and handle anomalous values
- **Optimize tables**: Index creation and performance improvements

### Quality Tracking
- **Historical tracking**: Monitor quality improvements across multiple uploads
- **Trend analysis**: See if your data quality is improving or declining
- **Up to 10 saved analyses**: Track progress over time
- **Visual dashboard**: Charts showing quality trends

### Accessibility
- **WCAG 2.1 AA compliant**: Screen reader support and keyboard navigation
- **Mobile-friendly**: Works on phones, tablets, and desktops
- **Help tooltips**: Context-sensitive guidance for all metrics

### Performance
- **Fast loading**: Optimized for 4G connections
- **Lighthouse scores**: Targeting 85+ performance, 90+ accessibility
- **Responsive design**: Touch-friendly 44px+ tap targets

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Install dependencies
npm install

# Add your OpenAI API key to .env.local
# OPENAI_API_KEY=your_key_here

# Run development server
npm run dev
```

Visit `http://localhost:3000` to start analyzing data!

## 📊 How It Works

1. **Upload CSV**: Drag and drop or click to upload your dataset
2. **Instant Analysis**: Get quality scores, statistics, and visualizations
3. **AI Insights**: Receive actionable recommendations
4. **Track Progress**: View history of past analyses and trends

## 🎯 Target Users

- Data analysts in small-to-mid-sized organizations
- Business users working with exported CSV datasets
- Students learning data analytics
- Non-technical teams building reports
- Anyone needing to validate data before analysis

## 📈 Quality Metrics & Detection

### Data Quality Scoring
- **Completeness**: Percentage of non-empty cells
- **Duplicate Detection**: Identifies exact duplicate rows
- **Data Type Detection**: Automatic classification (number, string, date, boolean)
- **Statistical Analysis**: Mean, median, std dev for numeric columns
- **Missing Values**: Per-column breakdown

### Anomaly Detection
- **Outlier Detection**: IQR-based method for numeric columns
- **Unusual Patterns**: Identifies abnormally long text fields
- **Severity Scoring**: High/Medium/Low risk classification

### Schema Issue Detection
- **Mixed Data Types**: Finds columns with inconsistent types
- **Inconsistent Formats**: Detects date and numeric format issues
- **High Cardinality**: Identifies potential unique identifiers
- **Excessive Missing Values**: Flags columns with >50% null data
- **Recommendations**: Specific suggestions for each issue

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🔒 Privacy

- All analysis happens in your browser
- CSV data stored temporarily in sessionStorage
- History saved in localStorage (never sent to servers)
- OpenAI API calls only send aggregated statistics (not raw data)

## 📝 Sample Datasets

Find sample CSV files in `public/datasets/`:
- `sample-sales.csv` - Sales transaction data
- `sample-customers.csv` - Customer information data

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (React 18)
- **AI**: OpenAI GPT-4
- **Charts**: Chart.js + React-ChartJS-2
- **CSV Parsing**: PapaParse
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS Modules with CSS Variables

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please follow accessibility and performance best practices.

---

Built with ❤️ for making data quality accessible to everyone
