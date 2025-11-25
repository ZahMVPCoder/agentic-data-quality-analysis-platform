# 🚀 Setup Guide - Agentic Data Quality Analysis Platform

## Step-by-Step Setup Instructions

### Prerequisites
- Node.js 18+ installed ([Download here](https://nodejs.org/))
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Git installed (optional)

---

## 1️⃣ Navigate to Project Directory

```bash
cd "c:/Projects/Zahir-agentic-data-quality-analysis-platform/agentic-data-quality-analysis-platform"
```

---

## 2️⃣ Install Dependencies

### Core Dependencies (Required)
```bash
npm install next@^14.0.0 react@^18.2.0 react-dom@^18.2.0
npm install papaparse@^5.4.1
npm install openai@^4.20.0
npm install chart.js@^4.4.0 react-chartjs-2@^5.2.0
```

**What each does:**
- `next`, `react`, `react-dom` - Next.js framework and React
- `papaparse` - CSV file parsing
- `openai` - OpenAI API integration for AI insights
- `chart.js`, `react-chartjs-2` - Data visualization charts

### Development Dependencies (Optional, for testing)
```bash
npm install --save-dev @testing-library/react@^14.0.0
npm install --save-dev @testing-library/jest-dom@^6.1.4
npm install --save-dev @vitejs/plugin-react@^4.2.0
npm install --save-dev vitest@^1.0.0
npm install --save-dev jsdom@^23.0.0
npm install --save-dev @vitest/ui
```

### Quick Install (All at Once)
```bash
npm install next@^14.0.0 react@^18.2.0 react-dom@^18.2.0 papaparse@^5.4.1 openai@^4.20.0 chart.js@^4.4.0 react-chartjs-2@^5.2.0 && npm install --save-dev @testing-library/react@^14.0.0 @testing-library/jest-dom@^6.1.4 @vitejs/plugin-react@^4.2.0 vitest@^1.0.0 jsdom@^23.0.0 @vitest/ui
```

---

## 3️⃣ Configure Environment Variables

### Create .env.local file
```bash
cp ../.env.local.example .env.local
```

### Or manually create `.env.local` with:
```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Specify OpenAI model (default: gpt-4)
OPENAI_MODEL=gpt-4

# Optional: OpenAI API timeout in milliseconds (default: 30000)
OPENAI_TIMEOUT=30000

# Application Configuration
NEXT_PUBLIC_APP_NAME=Agentic Data Quality Platform
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_MAX_HISTORY_ITEMS=10

# Development
NODE_ENV=development
```

**⚠️ IMPORTANT:** Replace `your_openai_api_key_here` with your actual OpenAI API key!

---

## 4️⃣ Initialize and Run

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Run Tests
```bash
npm test
```

### Run Tests with UI
```bash
npm run test:ui
```

---

## 5️⃣ Environment Variables Explained

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | ✅ Yes | Your OpenAI API key for AI insights | - |
| `OPENAI_MODEL` | ❌ No | OpenAI model to use | `gpt-4` |
| `OPENAI_TIMEOUT` | ❌ No | API timeout in milliseconds | `30000` |
| `NEXT_PUBLIC_APP_NAME` | ❌ No | Application display name | `Agentic Data Quality Platform` |
| `NEXT_PUBLIC_MAX_FILE_SIZE` | ❌ No | Max upload size in bytes | `10485760` (10MB) |
| `NEXT_PUBLIC_MAX_HISTORY_ITEMS` | ❌ No | Max history items to store | `10` |
| `NODE_ENV` | ❌ No | Environment mode | `development` |

---

## 6️⃣ Verify Installation

### Check Node.js version
```bash
node --version  # Should be 18 or higher
```

### Check npm version
```bash
npm --version
```

### Verify dependencies
```bash
npm list --depth=0
```

### Test the application
```bash
npm run dev
```
Then visit: **http://localhost:3000**

---

## 🎯 Quick Start Commands (Copy & Paste)

### Option A: Automated Setup Script
```bash
# Run the automated setup script
bash ../setup.sh
```

### Option B: Manual Setup (Windows/Bash)
```bash
# 1. Navigate to project
cd "c:/Projects/Zahir-agentic-data-quality-analysis-platform/agentic-data-quality-analysis-platform"

# 2. Install all dependencies
npm install next@^14.0.0 react@^18.2.0 react-dom@^18.2.0 papaparse@^5.4.1 openai@^4.20.0 chart.js@^4.4.0 react-chartjs-2@^5.2.0

# 3. Install dev dependencies
npm install --save-dev @testing-library/react@^14.0.0 @testing-library/jest-dom@^6.1.4 @vitejs/plugin-react@^4.2.0 vitest@^1.0.0 jsdom@^23.0.0 @vitest/ui

# 4. Copy environment file
cp ../.env.local.example .env.local

# 5. Edit .env.local and add your OpenAI API key
# Use your favorite editor: code .env.local, nano .env.local, or notepad .env.local

# 6. Start development server
npm run dev
```

---

## 📁 Final Folder Structure

```
agentic-data-quality-analysis-platform/
├── .env.local                    # Your environment variables (DO NOT COMMIT)
├── .gitignore                    # Git ignore rules
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── vitest.config.js              # Test configuration
├── app/                          # Next.js app directory
│   ├── layout.js                 # Root layout
│   ├── page.jsx                  # Home page
│   ├── analysis/                 # Analysis page
│   └── api/                      # API routes
├── components/                   # React components
│   ├── data/                     # Data components
│   ├── AnalysisHistory.jsx
│   ├── ErrorBoundary.jsx
│   ├── FileUpload.jsx
│   └── HelpTooltip.jsx
├── lib/                          # Utilities
│   ├── aiIntegration.js
│   ├── dataAnalysis.js
│   ├── historyTracker.js
│   └── sqlGenerator.js
├── public/                       # Static files
│   └── datasets/                 # Sample CSV files
├── styles/                       # CSS modules
├── test/                         # Test files
└── node_modules/                 # Dependencies (auto-generated)
```

---

## 🔍 Troubleshooting

### Issue: "Cannot find module 'next'"
**Solution:** Run `npm install` in the project directory

### Issue: "Missing OpenAI API key"
**Solution:** Ensure `.env.local` exists with `OPENAI_API_KEY=your_key`

### Issue: Port 3000 already in use
**Solution:** Run on different port: `npm run dev -- -p 3001`

### Issue: Module not found errors
**Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install`

---

## 🎉 Success Checklist

- [ ] Node.js 18+ installed
- [ ] All dependencies installed (`npm list --depth=0` shows no errors)
- [ ] `.env.local` created with OpenAI API key
- [ ] Development server starts (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can upload a CSV file and see results

---

## 📚 Next Steps

1. **Test with sample data**: Try uploading `public/datasets/sample-sales.csv`
2. **Run tests**: `npm test` to verify everything works
3. **Read the README**: Check `README.md` for feature documentation
4. **Deploy**: Consider deploying to Vercel, Netlify, or your preferred platform

---

## 🆘 Need Help?

- Check the [README.md](./README.md) for detailed feature documentation
- Review [Next.js docs](https://nextjs.org/docs)
- Visit [OpenAI API docs](https://platform.openai.com/docs)

**Happy analyzing! 🚀**
