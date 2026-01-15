'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    
    if (!apiKey.trim()) {
      setError('API key is required');
      return;
    }
    
    if (!githubUrl.trim()) {
      setError('GitHub URL is required');
      return;
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+$/;
    if (!githubUrlPattern.test(githubUrl.trim())) {
      setError('Invalid GitHub URL format. Please use: https://github.com/owner/repo');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim(),
        },
        body: JSON.stringify({
          githubUrl: githubUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch README');
        setLoading(false);
        return;
      }

      // Success - set result
      setResult(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching README');
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-white dark:bg-black`}>
      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar */}
        <aside className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-white dark:bg-zinc-900 ${sidebarOpen ? 'border-r border-zinc-200 dark:border-zinc-800' : ''} flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}>
          <Sidebar isOpen={sidebarOpen} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">Operational</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-black p-8">
            {/* Breadcrumb */}
            <div className="mb-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Pages / API Playground</p>
            </div>

            {/* Page Title */}
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-6">API Playground</h1>

            {/* Form Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 max-w-2xl">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
                GitHub Repository Analyzer
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Enter your API key and GitHub repository URL to fetch the README content.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    API Key
                  </label>
                  <input
                    type="text"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="tvly-dev-xxxxxxxxxxxxx"
                  />
                </div>

                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    GitHub Repository URL
                  </label>
                  <input
                    type="text"
                    id="githubUrl"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="https://github.com/owner/repo"
                  />
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Example: https://github.com/facebook/react
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      'Submit & Validate'
                    )}
                  </button>
                  <Link
                    href="/dashboards"
                    className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>

            {/* Results Section */}
            {result && (
              <div className="mt-8 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                    README Content
                  </h2>
                  <a
                    href={result.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    View on GitHub
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                
                {/* Repository Info */}
                <div className="mb-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <div className="mb-3">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Repository
                    </p>
                    <a
                      href={result.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-mono text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {result.githubUrl}
                    </a>
                  </div>
                  
                  {result.description && (
                    <div className="mb-3">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {result.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Stars */}
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {result.stars?.toLocaleString() || 0} stars
                      </span>
                    </div>
                    
                    {/* License */}
                    {result.license && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {result.license}
                        </span>
                      </div>
                    )}
                    
                    {/* Language */}
                    {result.language && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {result.language}
                        </span>
                      </div>
                    )}
                    
                    {/* Forks */}
                    {result.forks > 0 && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {result.forks?.toLocaleString() || 0} forks
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden">
                  <article className="markdown-body p-6 md:p-8">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result.readme}
                    </ReactMarkdown>
                  </article>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
