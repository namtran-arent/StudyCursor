'use client';

import { useState } from 'react';
import Notification from '@/components/Notification';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/dashboards/Header';
import PlanCard from '@/components/dashboards/PlanCard';
import ApiKeysTable from '@/components/dashboards/ApiKeysTable';
import ApiKeyModal from '@/components/dashboards/ApiKeyModal';
import DeleteModal from '@/components/dashboards/DeleteModal';
import { useApiKeys } from '@/hooks/useApiKeys';
import { generateApiKey } from '@/utils/apiKeyUtils';

export default function DashboardsPage() {
  const { apiKeys, loading, error, fetchApiKeys, createApiKey, updateApiKey, deleteApiKey } = useApiKeys();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    type: 'dev',
    description: '',
    monthlyLimit: 1000,
    limitEnabled: false,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState(new Set());
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [isNotificationAnimating, setIsNotificationAnimating] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState(null);
  const [deleteKeyName, setDeleteKeyName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleOpenModal = (key = null) => {
    if (key) {
      if (!key.id) {
        console.error('Cannot edit: API key missing ID', key);
        setNotification({ show: true, message: 'Cannot edit: API key is missing ID', type: 'error' });
        return;
      }
      setEditingKey({ ...key });
      setFormData({
        name: key.name,
        key: key.key,
        type: key.type || 'dev',
        description: key.description || '',
        monthlyLimit: key.monthlyLimit || 1000,
        limitEnabled: key.limitEnabled || false,
      });
    } else {
      setEditingKey(null);
      setFormData({
        name: '',
        key: '',
        type: 'dev',
        description: '',
        monthlyLimit: 1000,
        limitEnabled: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKey(null);
    setFormData({
      name: '',
      key: '',
      type: 'dev',
      description: '',
      monthlyLimit: 1000,
      limitEnabled: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const apiKey = formData.key || generateApiKey(formData.type);
      const payload = {
        name: formData.name,
        key: apiKey,
        type: formData.type,
        description: formData.description || null,
        monthlyLimit: formData.monthlyLimit || null,
        limitEnabled: formData.limitEnabled || false,
      };

      if (editingKey && editingKey.id) {
        await updateApiKey(editingKey.id, payload);
        showNotification('API key updated successfully', 'success');
      } else {
        await createApiKey(payload);
        showNotification('API key created successfully', 'success');
      }
      
      handleCloseModal();
    } catch (err) {
      console.error('Error saving API key:', err);
      showNotification(err.message, 'error');
    }
  };

  const handleDelete = (id, name) => {
    setDeleteKeyId(id);
    setDeleteKeyName(name);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteKeyId(null);
    setDeleteKeyName('');
  };

  const confirmDelete = async () => {
    if (!deleteKeyId) return;

    try {
      await deleteApiKey(deleteKeyId);
      showNotification('API key deleted successfully', 'success');
      handleCancelDelete();
    } catch (err) {
      console.error('Error deleting API key:', err);
      showNotification(err.message, 'error');
      handleCancelDelete();
    }
  };

  const handleCopyKey = async (key) => {
    try {
      await navigator.clipboard.writeText(key);
      setIsNotificationAnimating(false);
      setShowCopyNotification(true);
      setTimeout(() => {
        setIsNotificationAnimating(true);
      }, 10);
      setTimeout(() => {
        handleCloseNotification();
      }, 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy API key to clipboard');
    }
  };

  const handleCloseNotification = () => {
    setIsNotificationAnimating(false);
    setTimeout(() => {
      setShowCopyNotification(false);
    }, 300);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setIsNotificationAnimating(false);
    setTimeout(() => {
      setIsNotificationAnimating(true);
    }, 10);
    setTimeout(() => {
      hideNotification();
    }, 3000);
  };

  const hideNotification = () => {
    setIsNotificationAnimating(false);
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 300);
  };

  const toggleRevealKey = (keyId) => {
    setRevealedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
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
          <Header 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-black p-8">
            {/* Breadcrumb */}
            <div className="mb-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Pages / Overview</p>
            </div>

            {/* Page Title */}
            <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-6">Overview</h1>

            {/* Notifications */}
            <Notification
              show={showCopyNotification}
              message="Copied API Key to clipboard"
              type="success"
              isAnimating={isNotificationAnimating}
              onClose={handleCloseNotification}
            />
            <Notification
              show={notification.show}
              message={notification.message}
              type={notification.type}
              isAnimating={isNotificationAnimating}
              onClose={hideNotification}
            />

            {/* Certification Banner */}
            <div className="mb-6 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg p-4 text-white">
              <p className="font-medium">Get Tavily Certified! Share Your Badge & Earn Free Credits</p>
            </div>

            {/* Current Plan Card */}
            <PlanCard />

            {/* API Keys Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50">API Keys</h2>
                <button
                  onClick={() => handleOpenModal()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
                  disabled={loading}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Key
                </button>
              </div>

              <ApiKeysTable
                apiKeys={apiKeys}
                loading={loading}
                error={error}
                revealedKeys={revealedKeys}
                onToggleReveal={toggleRevealKey}
                onCopy={handleCopyKey}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
                onCreateNew={() => handleOpenModal()}
                onRetry={fetchApiKeys}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      <ApiKeyModal
        isOpen={isModalOpen}
        editingKey={editingKey}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onClose={handleCloseModal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        keyName={deleteKeyName}
        onConfirm={confirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
