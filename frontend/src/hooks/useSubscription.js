import { useState, useCallback } from 'react';
import api from '../services/api';

export function useSubscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSubscription = useCallback(async (channelId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/subscriptions/c/${channelId}`);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getChannelSubscribers = useCallback(async (channelId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/subscriptions/c/${channelId}/subscribers`);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subscribers');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getSubscribedChannels = useCallback(async (subscriberId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/subscriptions/u/${subscriberId}/channels`);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subscriptions');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    toggleSubscription,
    getChannelSubscribers,
    getSubscribedChannels,
  };
}
