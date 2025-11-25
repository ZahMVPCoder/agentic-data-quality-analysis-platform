import '../styles/globals.css';

export const metadata = {
  title: 'Agentic Data Quality Analysis Platform',
  description: 'AI-powered data quality analysis and insights',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
