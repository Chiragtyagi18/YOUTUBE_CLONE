import { useState, useCallback } from 'react';
import api from '../services/api';

export function usePlaylist() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserPlaylists = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/playlists/user/${userId}`);
      setPlaylists(response.data.data || []);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch playlists');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (playlistId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/playlists/${playlistId}`);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch playlist');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (name, description) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/playlists', { name, description });
      const newPlaylist = response.data.data;
      setPlaylists([...playlists, newPlaylist]);
      return newPlaylist;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create playlist');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [playlists]);

  const update = useCallback(async (playlistId, name, description) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/playlists/${playlistId}`, { name, description });
      setPlaylists(playlists.map(p => p._id === playlistId ? response.data.data : p));
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update playlist');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [playlists]);

  const deletePlaylist = useCallback(async (playlistId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/playlists/${playlistId}`);
      setPlaylists(playlists.filter(p => p._id !== playlistId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete playlist');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [playlists]);

  const addVideo = useCallback(async (playlistId, videoId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/playlists/${playlistId}/videos/${videoId}`);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add video');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeVideo = useCallback(async (playlistId, videoId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/playlists/${playlistId}/videos/${videoId}`);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove video');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    playlists,
    loading,
    error,
    fetchUserPlaylists,
    fetchById,
    create,
    update,
    deletePlaylist,
    addVideo,
    removeVideo,
  };
}
