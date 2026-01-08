'use client';

import { generateApiKey } from '@/utils/apiKeyUtils';

export default function ApiKeyModal({ 
  isOpen, 
  editingKey, 
  formData, 
  setFormData, 
  onSubmit, 
  onClose 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-lg w-full p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
          {editingKey ? 'Edit API Key' : 'Create a new API key'}
        </h2>
        {!editingKey && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            Enter a name and limit for the new API key.
          </p>
        )}
        <form onSubmit={onSubmit}>
          {/* Key Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Key Name <span className="text-zinc-500">— A unique name to identify this key</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Key Name"
            />
          </div>

          {/* Key Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
              Key Type <span className="text-zinc-500">— Choose the environment for this key</span>
            </label>
            <div className="space-y-3">
              {/* Development Option */}
              <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.type === 'dev' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}>
                <input
                  type="radio"
                  name="keyType"
                  value="dev"
                  checked={formData.type === 'dev'}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFormData({ 
                      ...formData, 
                      type: newType,
                      key: formData.key ? formData.key.replace(/^tvly-\w+-/, `tvly-${newType}-`) : generateApiKey(newType)
                    });
                  }}
                  className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span className="font-medium text-black dark:text-zinc-50">Development</span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Rate limited to 100 requests/minute</p>
                </div>
              </label>

              {/* Production Option */}
              <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.type === 'prod' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}>
                <input
                  type="radio"
                  name="keyType"
                  value="prod"
                  checked={formData.type === 'prod'}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFormData({ 
                      ...formData, 
                      type: newType,
                      key: formData.key ? formData.key.replace(/^tvly-\w+-/, `tvly-${newType}-`) : generateApiKey(newType)
                    });
                  }}
                  className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-medium text-black dark:text-zinc-50">Production</span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">Rate limited to 1,000 requests/minute</p>
                </div>
              </label>
            </div>
          </div>

          {/* Limit Monthly Usage */}
          <div className="mb-6">
            <div className="flex items-start gap-3 mb-3">
              <input
                type="checkbox"
                id="limitEnabled"
                checked={formData.limitEnabled}
                onChange={(e) => setFormData({ ...formData, limitEnabled: e.target.checked })}
                className="mt-1 w-4 h-4 text-purple-600 focus:ring-purple-500 border-zinc-300 dark:border-zinc-700 rounded"
              />
              <label htmlFor="limitEnabled" className="flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Limit monthly usage<span className="text-red-500">*</span>
              </label>
            </div>
            {formData.limitEnabled && (
              <input
                type="number"
                value={formData.monthlyLimit}
                onChange={(e) => setFormData({ ...formData, monthlyLimit: parseInt(e.target.value) || 0 })}
                min="1"
                className="w-full px-4 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="1000"
              />
            )}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-6">
            <span className="text-red-500">*</span> If the combined usage of all your keys exceeds your account's allocated usage limit (plan, add-ons, and any pay-as-you-go limit), all requests will be rejected.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors font-medium"
            >
              {editingKey ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
