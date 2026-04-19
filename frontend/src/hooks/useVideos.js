import { useState, useCallback } from 'react';
import api from '../services/api';

export function useVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/videos');
      setVideos(response.data.data || []);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch videos');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (videoId, incrementViews = true) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/videos/${videoId}`, {
        params: { incrementViews: incrementViews ? 'true' : 'false' }
      });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch video');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (videoData, videoFile, thumbnailFile) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', videoData.title);
      formData.append('description', videoData.description);
      formData.append('isPublished', videoData.isPublished);
      if (videoFile) formData.append('videoFile', videoFile);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      const response = await api.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create video');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (videoId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/videos/${videoId}`, updateData);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update video');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVideo = useCallback(async (videoId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/videos/${videoId}`);
      setVideos(videos.filter(v => v._id !== videoId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete video');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [videos]);

  const togglePublish = useCallback(async (videoId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/videos/${videoId}/toggle-publish`);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle publish');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    videos,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    deleteVideo,
    togglePublish,
  };
}
