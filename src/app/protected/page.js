'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Notification from '@/components/Notification';

export default function ProtectedPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isNotificationAnimating, setIsNotificationAnimating] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const validateApiKey = async () => {
      // Get API key from sessionStorage
      const apiKey = sessionStorage.getItem('apiKeyToValidate');
      
      if (!apiKey) {
        // No API key found, redirect to playground
        router.push('/playground');
        return;
      }

      try {
        setIsValidating(true);
        const response = await fetch('/api/api-keys/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key: apiKey }),
        });

        // Check if response has content and is JSON
        const contentType = response.headers.get('content-type');
        let data = null;
        
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text();
          if (text) {
            try {
              data = JSON.parse(text);
            } catch (parseError) {
              console.error('Failed to parse JSON:', parseError);
              showNotification('Invalid response from server', 'error');
              sessionStorage.removeItem('apiKeyToValidate');
              return;
            }
          }
        }

        // Check response status
        if (response.status === 200) {
          // Valid API key (200 OK)
          if (data && data.valid) {
            showNotification('Valid API key, /protected can be accessed', 'success');
            // Clear the API key from sessionStorage after validation
            sessionStorage.removeItem('apiKeyToValidate');
          } else {
            // Should not happen, but handle it anyway
            showNotification('Invalid API key', 'error');
            sessionStorage.removeItem('apiKeyToValidate');
          }
        } else if (response.status === 401) {
          // Invalid API key (401 Unauthorized)
          const errorMessage = data?.error || 'Invalid API key';
          showNotification(errorMessage, 'error');
          // Clear the API key from sessionStorage
          sessionStorage.removeItem('apiKeyToValidate');
        } else {
          // Other errors (500, etc.)
          const errorMessage = data?.error || 'Failed to validate API key';
          showNotification(errorMessage, 'error');
          sessionStorage.removeItem('apiKeyToValidate');
        }
      } catch (error) {
        console.error('Error validating API key:', error);
        showNotification('Invalid API key', 'error');
        sessionStorage.removeItem('apiKeyToValidate');
      } finally {
        setIsValidating(false);
      }
    };

    validateApiKey();
  }, [router]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setIsNotificationAnimating(false);
    setTimeout(() => {
      setIsNotificationAnimating(true);
    }, 10);
    setTimeout(() => {
      hideNotification();
    }, 5000);
  };

  const hideNotification = () => {
    setIsNotificationAnimating(false);
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 300);
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
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Pages / Protected</p>
            </div>

            {/* Page Title */}
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-6">Protected Area</h1>

            {/* Content Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 max-w-2xl">
              {isValidating ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-zinc-600 dark:text-zinc-400">Validating API key...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
                    Welcome to Protected Area
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                    This is a protected area that requires a valid API key to access.
                  </p>
                  <Link
                    href="/playground"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-medium"
                  >
                    Try Another API Key
                  </Link>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Notification */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        isAnimating={isNotificationAnimating}
        onClose={hideNotification}
      />
    </div>
  );
}
