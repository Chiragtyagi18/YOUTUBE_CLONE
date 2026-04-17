import { useState, useCallback } from 'react';
import api from '../services/api';

export function useComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchByVideo = useCallback(async (videoId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/comments?videoId=${videoId}`);
      setComments(response.data.data || []);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch comments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByTweet = useCallback(async (tweetId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/comments?tweetId=${tweetId}`);
      setComments(response.data.data || []);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch comments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (content, videoId, tweetId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/comments', {
        content,
        ...(videoId && { videoId }),
        ...(tweetId && { tweetId }),
      });
      const newComment = response.data.data;
      setComments([newComment, ...comments]);
      return newComment;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create comment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [comments]);

  const update = useCallback(async (commentId, content) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/comments/${commentId}`, { content });
      setComments(comments.map(c => c._id === commentId ? response.data.data : c));
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update comment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [comments]);

  const deleteComment = useCallback(async (commentId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [comments]);

  return {
    comments,
    loading,
    error,
    fetchByVideo,
    fetchByTweet,
    create,
    update,
    deleteComment,
  };
}
