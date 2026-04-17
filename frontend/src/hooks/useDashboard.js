import { useState, useCallback } from 'react';
import api from '../services/api';

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChannelVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboard/videos');
      setVideos(response.data.data || []);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch videos');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    videos,
    loading,
    error,
    fetchStats,
    fetchChannelVideos,
  };
}
