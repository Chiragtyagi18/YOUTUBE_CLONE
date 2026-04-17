import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlaylist } from '../hooks/usePlaylist';

export function PlaylistsPage() {
  const { user, isAuthenticated } = useAuth();
  const {
    playlists,
    loading,
    fetchUserPlaylists,
    create: createPlaylist,
    deletePlaylist,
  } = usePlaylist();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchUserPlaylists(user._id);
    }
  }, [isAuthenticated, user?._id]);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setCreateError('Playlist name is required');
      return;
    }

    try {
      await createPlaylist(formData.name, formData.description);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      setCreateError('');
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create playlist');
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await deletePlaylist(playlistId);
      } catch (err) {
        console.error('Failed to delete playlist:', err);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 px-4 pb-2 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">View Your Playlists</h2>
          <p className="text-gray-400 mb-6">Sign in to see your playlists</p>
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">My Playlists</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition"
          >
            {showCreateForm ? 'Cancel' : 'Create Playlist'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-darkGray rounded-lg p-6 mb-8 border border-gray-600">
            <h2 className="text-xl font-bold text-white mb-4">Create New Playlist</h2>
            
            {createError && (
              <div className="bg-red-900 text-red-100 p-3 rounded-lg mb-4 text-sm">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter playlist name"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter playlist description (optional)"
                  rows="3"
                  className="w-full"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-red-600 transition"
              >
                Create Playlist
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400">Loading playlists...</div>
        ) : playlists && playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="bg-darkGray rounded-lg overflow-hidden border border-gray-600 hover:border-primary transition group cursor-pointer"
              >
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">📋</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white group-hover:text-primary transition line-clamp-2">
                    {playlist.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {playlist.videos?.length || 0} videos
                  </p>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {playlist.description}
                  </p>
                  <button
                    onClick={() => handleDeletePlaylist(playlist._id)}
                    className="mt-4 w-full px-3 py-2 bg-red-900 text-red-200 text-sm rounded hover:bg-red-800 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No playlists yet. Create your first one!
          </div>
        )}
      </div>
    </div>
  );
}
