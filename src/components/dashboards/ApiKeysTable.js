'use client';

import { maskApiKey } from '@/utils/apiKeyUtils';

export default function ApiKeysTable({ 
  apiKeys, 
  loading, 
  error, 
  revealedKeys, 
  onToggleReveal, 
  onCopy, 
  onEdit, 
  onDelete,
  onCreateNew,
  onRetry 
}) {
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading API keys...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-800 dark:text-red-300">
          Error: {error}
        </p>
        <button
          onClick={onRetry}
          className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">No API keys yet. Create your first one!</p>
        <button
          onClick={onCreateNew}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          Create API Key
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">NAME</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">TYPE</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">USAGE</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">KEY</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">OPTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {apiKeys.map((key) => (
              <tr key={key.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-zinc-50">{key.name}</td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
                    {key.type || 'dev'}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">{key.usage || 0}</td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400 font-mono break-all max-w-xs">
                  {revealedKeys.has(key.id) ? key.key : maskApiKey(key.key)}
                </td>
                <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleReveal(key.id)}
                      className={`${revealedKeys.has(key.id) ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400'} hover:text-zinc-900 dark:hover:text-zinc-100`}
                      title={revealedKeys.has(key.id) ? 'Hide' : 'View'}
                    >
                      {revealedKeys.has(key.id) ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 003 12c0 5.523 4.477 10 10 10 2.125 0 4.078-.736 5.625-1.992m-3.59-3.59A9.959 9.959 0 0121 12c0-5.523-4.477-10-10-10a9.953 9.953 0 00-5.41 1.59m3.59 3.59L12 12m-8-8l16 16" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => onCopy(key.key)}
                      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      title="Copy"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(key)}
                      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(key.id, key.name)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {apiKeys.map((key) => (
          <div key={key.id} className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-black dark:text-zinc-50 truncate">{key.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-medium">
                    {key.type || 'dev'}
                  </span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">Usage: {key.usage || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 dark:text-zinc-400">API Key</span>
                <button
                  onClick={() => onToggleReveal(key.id)}
                  className={`${revealedKeys.has(key.id) ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400'} hover:text-zinc-900 dark:hover:text-zinc-100`}
                  title={revealedKeys.has(key.id) ? 'Hide' : 'View'}
                >
                  {revealedKeys.has(key.id) ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 003 12c0 5.523 4.477 10 10 10 2.125 0 4.078-.736 5.625-1.992m-3.59-3.59A9.959 9.959 0 0121 12c0-5.523-4.477-10-10-10a9.953 9.953 0 00-5.41 1.59m3.59 3.59L12 12m-8-8l16 16" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded px-3 py-2 border border-zinc-200 dark:border-zinc-700">
                <p className="text-xs font-mono text-zinc-900 dark:text-zinc-100 break-all">
                  {revealedKeys.has(key.id) ? key.key : maskApiKey(key.key)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => onCopy(key.key)}
                className="flex-1 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
              <button
                onClick={() => onEdit(key)}
                className="flex-1 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => onDelete(key.id, key.name)}
                className="px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-zinc-800 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
