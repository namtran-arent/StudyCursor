'use client';

import { useState, useEffect } from 'react';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/api-keys');
      
      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }
      
      const data = await response.json();
      // Transform data from database format to frontend format
      const transformedData = data.map(key => ({
        id: key.id,
        name: key.name,
        key: key.key,
        type: key.type,
        description: key.description,
        monthlyLimit: key.monthly_limit,
        limitEnabled: key.limit_enabled,
        usage: key.usage || 0,
        createdAt: key.created_at,
      }));
      setApiKeys(transformedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching API keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (payload) => {
    const response = await fetch('/api/api-keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create API key');
    }

    const newKey = await response.json();
    // Transform and add to state
    const transformedKey = {
      id: newKey.id,
      name: newKey.name,
      key: newKey.key,
      type: newKey.type,
      description: newKey.description,
      monthlyLimit: newKey.monthly_limit,
      limitEnabled: newKey.limit_enabled,
      usage: newKey.usage || 0,
      createdAt: newKey.created_at,
    };
    setApiKeys([...apiKeys, transformedKey]);
    return transformedKey;
  };

  const updateApiKey = async (id, payload) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid API key ID');
    }

    const response = await fetch(`/api/api-keys/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update API key');
    }

    const updatedKey = await response.json();
    // Transform and update state
    const transformedKey = {
      id: updatedKey.id,
      name: updatedKey.name,
      key: updatedKey.key,
      type: updatedKey.type,
      description: updatedKey.description,
      monthlyLimit: updatedKey.monthly_limit,
      limitEnabled: updatedKey.limit_enabled,
      usage: updatedKey.usage || 0,
      createdAt: updatedKey.created_at,
    };
    setApiKeys(apiKeys.map(key => 
      key.id === id ? transformedKey : key
    ));
    return transformedKey;
  };

  const deleteApiKey = async (id) => {
    const response = await fetch(`/api/api-keys/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete API key');
    }

    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return {
    apiKeys,
    loading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
}
