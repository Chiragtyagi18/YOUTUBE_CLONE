import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RegisterPage() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [files, setFiles] = useState({
    avatar: null,
    coverImage: null,
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFiles((prev) => ({ ...prev, [name]: e.target.files?.[0] || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(formData.fullName, formData.username, formData.email, formData.password, files);
      navigate('/');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 pt-16 pb-8">
      <div className="w-full max-w-md">
        {/* Decorative Background */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative bg-gradient-to-br from-secondary to-[#1a1a1a] rounded-2xl p-8 border border-gray-700 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4 shadow-glow">
              <span className="text-white text-2xl font-bold">▶</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2">Create Account</h1>
            <p className="text-gray-400">Join our video community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || localError) && (
              <div className="bg-red-500 bg-opacity-20 text-red-300 p-4 rounded-lg text-sm border border-red-700 flex items-center gap-3">
                <span>⚠️</span>
                <span>{error || localError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-secondary text-white border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-red-500 focus:ring-opacity-30 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className="w-full bg-secondary text-white border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-red-500 focus:ring-opacity-30 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-secondary text-white border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-red-500 focus:ring-opacity-30 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-secondary text-white border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-red-500 focus:ring-opacity-30 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-secondary text-white border border-gray-700 rounded-lg px-4 py-3 focus:border-primary focus:ring-2 focus:ring-red-500 focus:ring-opacity-30 transition-all duration-200"
              />
            </div>

            <div className="border-t border-gray-700 pt-4 mt-4">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                📸 Avatar (Optional)
              </label>
              <input
                type="file"
                name="avatar"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full bg-secondary text-gray-300 border border-gray-700 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-all duration-200 text-sm"
              />
              {files.avatar && (
                <p className="text-sm text-green-400 mt-2 flex items-center gap-2">
                  ✓ {files.avatar.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                🖼️ Cover Image (Optional)
              </label>
              <input
                type="file"
                name="coverImage"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full bg-secondary text-gray-300 border border-gray-700 rounded-lg px-4 py-2 cursor-pointer hover:border-primary transition-all duration-200 text-sm"
              />
              {files.coverImage && (
                <p className="text-sm text-green-400 mt-2 flex items-center gap-2">
                  ✓ {files.coverImage.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-white font-bold py-3 rounded-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 group"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Creating Account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:text-red-400 font-semibold transition-colors duration-200">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
