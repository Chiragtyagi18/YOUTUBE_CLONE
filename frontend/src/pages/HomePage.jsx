import { useEffect, useState } from 'react';
import { useVideos } from '../hooks/useVideos';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../hooks/useAuth';
import { VideoCard } from '../components/VideoCard';

export function HomePage() {
  const { videos, loading, error, fetchAll } = useVideos();
  const { getSubscribedChannels } = useSubscription();
  const { user } = useAuth();
  const [filter, setFilter] = useState('latest');
  const [subscribedChannels, setSubscribedChannels] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (user?._id) {
      getSubscribedChannels(user._id).then(channels => {
        setSubscribedChannels(channels || []);
      });
    }
  }, [user?._id]);

  const sortedVideos = [...videos].sort((a, b) => {
    if (filter === 'latest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (filter === 'trending') {
      return b.views - a.views;
    }
    if (filter === 'subscriptions') {
      const aIsSubscribed = subscribedChannels.some(ch => ch._id === a.owner?._id);
      const bIsSubscribed = subscribedChannels.some(ch => ch._id === b.owner?._id);
      if (aIsSubscribed && !bIsSubscribed) return -1;
      if (!aIsSubscribed && bIsSubscribed) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const filteredVideos = filter === 'subscriptions' 
    ? sortedVideos.filter(video => subscribedChannels.some(ch => ch._id === video.owner?._id))
    : sortedVideos;

  const filterItems = [
    { key: 'latest', label: 'Latest', icon: '🕐' },
    { key: 'trending', label: 'Trending', icon: '🔥' },
    { key: 'subscriptions', label: 'Subscriptions', icon: '⭐' }
  ];

  return (
    <div className="pt-24 px-4 pb-8 bg-gradient-dark min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Filter Section */}
        <div className="flex gap-3 mb-10 pb-6 border-b border-gray-700 overflow-x-auto scrollbar-hide">
          {filterItems.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full whitespace-nowrap font-semibold transition-all duration-300 ${
                filter === f.key
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'bg-secondary text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-lg">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
              <p className="text-gray-400">Loading videos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-secondary rounded-xl p-8 border border-red-700">
            <p className="text-red-400 font-semibold mb-2">⚠️ Error</p>
            <p className="text-gray-300">{error}</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-secondary rounded-xl p-8 border border-gray-700">
            <p className="text-gray-400 text-lg">🎬 No videos found</p>
            <p className="text-gray-500 text-sm mt-2">Try uploading your first video!</p>
          </div>
        ) : filter === 'subscriptions' && filteredVideos.length === 0 ? (
          <div className="text-center py-20 bg-secondary rounded-xl p-8 border border-gray-700">
            <p className="text-gray-400 text-lg">⭐ No subscriptions yet</p>
            <p className="text-gray-500 text-sm mt-2">Subscribe to channels to see their videos here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
