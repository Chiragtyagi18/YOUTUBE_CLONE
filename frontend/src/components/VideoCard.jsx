import { Link } from 'react-router-dom';

export function VideoCard({ video }) {
  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/320x180?text=No+Thumbnail';
    return url;
  };

  const formatViews = (views) => {
    if (!views) return '0';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}m ago`;
    return `${Math.floor(months / 12)}y ago`;
  };

  return (
    <Link to={`/watch/${video._id}`} className="block group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl bg-secondary aspect-video mb-4 shadow-lg group-hover:shadow-glow transition-all duration-300">
        <img
          src={getImageUrl(video.thumbnail)}
          alt={video.title}
          crossOrigin="anonymous"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-90 px-3 py-1 rounded-lg text-xs text-white font-semibold">
          {video.duration ? `${Math.floor(video.duration / 60)}:${Math.floor(video.duration % 60).toString().padStart(2, '0')}` : '0:00'}
        </div>
      </div>
      
      <div className="flex gap-3 px-1">
        <div className="flex-shrink-0">
          <img
            src={video.owner?.avatar || 'https://via.placeholder.com/48'}
            alt="Channel"
            crossOrigin="anonymous"
            className="w-9 h-9 rounded-full object-cover border border-gray-700"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white line-clamp-2 group-hover:text-red-400 transition-colors duration-300 text-sm">
            {video.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 hover:text-gray-300 transition-colors">
            {video.owner?.username}
          </p>
          <p className="text-xs text-gray-500">
            {formatViews(video.views)} views • {formatDate(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
