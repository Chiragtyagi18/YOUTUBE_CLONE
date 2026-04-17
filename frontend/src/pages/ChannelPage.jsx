import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useVideos } from '../hooks/useVideos';
import { useSubscription } from '../hooks/useSubscription';
import api from '../services/api';
import { VideoCard } from '../components/VideoCard';
import { getAvatarUrl, getCoverImageUrl } from '../utils/defaultImages';

export function ChannelPage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const { getChannelSubscribers, getSubscribedChannels } = useSubscription();
  const [channel, setChannel] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    const loadChannel = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try to fetch using username first (for backward compatibility)
        const response = await api.get(`/users/channel/${username}`);
        const channelData = response.data.data;
        setChannel(channelData);

        if (channelData._id) {
          const videosRes = await api.get('/videos', {
            params: { owner: channelData._id, isPublished: 'true' },
          });
          setChannelVideos(videosRes.data.data || []);

          const subs = await getChannelSubscribers(channelData._id);
          setSubscribers(Array.isArray(subs) ? subs : []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load channel');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      loadChannel();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="pt-20 px-4 pb-8 text-center text-gray-400">
        Loading channel...
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="pt-20 px-4 pb-8 text-center text-red-500">
        {error || 'Channel not found'}
      </div>
    );
  }

  const isOwnChannel = currentUser?._id === channel._id;

  return (
    <div className="pt-16">
      {/* Cover Image */}
      <div
        className="w-full h-48 bg-gradient-to-r from-primary to-red-700 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getCoverImageUrl(channel.coverImage)})`,
        }}
      />

      {/* Channel Header */}
      <div className="bg-dark px-4 py-8 border-b border-darkGray">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:gap-6">
          <img
            src={getAvatarUrl(channel.avatar)}
            alt={channel.username}
            crossOrigin="anonymous"
            className="w-32 h-32 rounded-full object-cover -mt-20 border-4 border-dark"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mt-4 sm:mt-0">
              {channel.fullName}
            </h1>
            <p className="text-gray-400">@{channel.username}</p>
            <p className="text-gray-400 text-sm mt-1">
              {channel.subscribersCount || 0} subscribers • {channelVideos.length} videos
            </p>
          </div>

          {!isOwnChannel && (
            <button className="px-6 py-2 bg-white text-dark rounded-full font-semibold hover:opacity-80 transition">
              Subscribe
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark px-4 border-b border-darkGray sticky top-16 z-40">
        <div className="max-w-7xl mx-auto flex gap-8">
          {['videos', 'playlists', 'about'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 border-b-2 transition ${
                activeTab === tab
                  ? 'border-primary text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-dark px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'videos' && (
            <div>
              {channelVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {channelVideos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No videos uploaded yet
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-white mb-4">About</h2>
              <p className="text-gray-300 mb-6">{channel.fullName}</p>
              {channel.email && (
                <p className="text-gray-400">Email: {channel.email}</p>
              )}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="text-center py-12 text-gray-400">
              No playlists yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
