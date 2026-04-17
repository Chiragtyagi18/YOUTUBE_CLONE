import { useState, useCallback } from 'react';
import api from '../services/api';

export function useTweets() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/tweets');
      setTweets(response.data.data || []);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tweets');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (content) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/tweets', { content });
      const newTweet = response.data.data;
      setTweets([newTweet, ...tweets]);
      return newTweet;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create tweet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tweets]);

  const update = useCallback(async (tweetId, content) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/tweets/${tweetId}`, { content });
      setTweets(tweets.map(t => t._id === tweetId ? response.data.data : t));
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update tweet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tweets]);

  const deleteTweet = useCallback(async (tweetId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/tweets/${tweetId}`);
      setTweets(tweets.filter(t => t._id !== tweetId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete tweet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [tweets]);

  return {
    tweets,
    loading,
    error,
    fetchAll,
    create,
    update,
    deleteTweet,
  };
}
