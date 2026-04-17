import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { useVideos } from '../hooks/useVideos';

export function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const { stats, videos, loading, fetchStats, fetchChannelVideos } = useDashboard();
  const { togglePublish, deleteVideo } = useVideos();
  const [publishStatus, setPublishStatus] = useState({});
  const [deleting, setDeleting] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchChannelVideos();
    }
  }, [isAuthenticated]);

  const handleTogglePublish = async (videoId) => {
    try {
      await togglePublish(videoId);
      // Refresh the video list after toggling publish
      await fetchChannelVideos();
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    setDeleting((prev) => ({
      ...prev,
      [videoId]: true,
    }));

    try {
      await deleteVideo(videoId);
      // Refresh stats and videos after deletion
      await fetchStats();
      await fetchChannelVideos();
    } catch (err) {
      console.error('Failed to delete video:', err);
      alert('Failed to delete video. Please try again.');
    } finally {
      setDeleting((prev) => ({
        ...prev,
        [videoId]: false,
      }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 px-4 pb-2 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Access Dashboard</h2>
          <p className="text-gray-400 mb-6">Sign in to view your dashboard</p>
          <a
            href="/login"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-600"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 pb-2">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-darkGray p-6 rounded-lg border border-gray-600">
              <p className="text-gray-400 text-sm mb-2">Total Views</p>
              <p className="text-3xl font-bold text-white">{stats.totalViews || 0}</p>
            </div>
            <div className="bg-darkGray p-6 rounded-lg border border-gray-600">
              <p className="text-gray-400 text-sm mb-2">Total Subscribers</p>
              <p className="text-3xl font-bold text-white">{stats.totalSubscribers || 0}</p>
            </div>
            <div className="bg-darkGray p-6 rounded-lg border border-gray-600">
              <p className="text-gray-400 text-sm mb-2">Total Videos</p>
              <p className="text-3xl font-bold text-white">{stats.totalVideos || 0}</p>
            </div>
            <div className="bg-darkGray p-6 rounded-lg border border-gray-600">
              <p className="text-gray-400 text-sm mb-2">Avg Views/Video</p>
              <p className="text-3xl font-bold text-white">
                {stats.totalVideos ? Math.round((stats.totalViews || 0) / stats.totalVideos) : 0}
              </p>
            </div>
          </div>
        )}

        {/* Videos Table */}
        <div className="bg-darkGray rounded-lg border border-gray-600 overflow-hidden">
          <div className="p-6 border-b border-gray-600">
            <h2 className="text-xl font-bold text-white">Your Videos</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-400">Loading videos...</div>
          ) : videos && videos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-300">
                <thead className="bg-dark border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left">Video</th>
                    <th className="px-6 py-4 text-left">Views</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video) => (
                    <tr key={video._id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={video.thumbnail || 'https://via.placeholder.com/48'}
                            alt={video.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">{video.title}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(video.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{video.views || 0}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            video.isPublished
                              ? 'bg-green-900 text-green-200'
                              : 'bg-yellow-900 text-yellow-200'
                          }`}
                        >
                          {video.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTogglePublish(video._id)}
                            className="px-3 py-1 bg-white text-dark text-xs rounded hover:opacity-80 transition font-semibold"
                          >
                            {video.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video._id)}
                            disabled={deleting[video._id]}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition font-semibold disabled:opacity-50"
                          >
                            {deleting[video._id] ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400">
              No videos yet. <a href="/upload" className="text-white hover:opacity-80 font-semibold">Upload your first video</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
