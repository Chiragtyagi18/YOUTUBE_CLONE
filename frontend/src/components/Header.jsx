import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-secondary via-[#1f1f1f] to-secondary border-b border-gray-700 z-50 backdrop-blur-md bg-opacity-90">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow group-hover:shadow-lg transition-shadow">
            <span className="text-white font-bold text-lg">▶</span>
          </div>
          <span className="text-2xl font-bold text-white hidden sm:inline bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Stream</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center px-4 hidden sm:flex">
          <div className="w-full max-w-md relative">
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full bg-secondary text-white px-4 py-2 rounded-full border border-gray-700 focus:border-primary focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 backdrop-blur-sm transition-all duration-200"
            />
            <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link 
                to="/upload" 
                className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-primary text-white hover:shadow-glow transition-all duration-300 font-semibold group"
              >
                <span className="group-hover:scale-110 transition-transform">📤</span>
                Upload
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold hover:shadow-glow transition-all duration-300 overflow-hidden"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" crossOrigin="anonymous" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    user?.fullName?.[0] || 'U'
                  )}
                </button>
                
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-secondary rounded-xl shadow-2xl py-2 border border-gray-700 backdrop-blur-md">
                    <Link 
                      to={`/channel/${user?.username}`} 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 hover:bg-opacity-50 transition-all duration-200 text-gray-100 hover:text-white"
                    >
                      <span>👤</span>
                      <span>My Channel</span>
                    </Link>
                    <Link 
                      to="/profile-settings" 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 hover:bg-opacity-50 transition-all duration-200 text-gray-100 hover:text-white"
                    >
                      <span>⚙️</span>
                      <span>Profile Settings</span>
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 hover:bg-opacity-50 transition-all duration-200 text-gray-100 hover:text-white"
                    >
                      <span>📊</span>
                      <span>Dashboard</span>
                    </Link>
                    <Link 
                      to="/playlists" 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 hover:bg-opacity-50 transition-all duration-200 text-gray-100 hover:text-white"
                    >
                      <span>🎬</span>
                      <span>Playlists</span>
                    </Link>
                    <div className="border-t border-gray-700 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-700 hover:bg-opacity-50 text-red-500 hover:text-red-400 transition-all duration-200 flex items-center gap-3"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-white hover:text-red-400 transition-colors duration-200 font-semibold"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2 rounded-full bg-gradient-primary text-white hover:shadow-glow transition-all duration-300 font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
